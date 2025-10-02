import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";

// Sätt cookie
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ms(JWT_EXPIRES_IN || "30d"), // cookie livslängd = JWT_EXPIRES_IN
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.render("auth/sign-up", {
        title: "Register",
        error: "Please fill in all fields",
      });
    }

    // kolla om email finns
    const exists = await User.findOne({ email });
    if (exists) {
      return res.render("auth/sign-up", {
        title: "Register",
        error: "Email is already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const user = await User.create({ username, email, password: hash });

    // skapa token + cookie
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "30d",
    });
    setAuthCookie(res, token);

    // redirect
    return res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/sign-in", {
        title: "Login",
        error: "Please fill in both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/sign-in", {
        title: "Login",
        error: "Invalid credentials",
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.render("auth/sign-in", {
        title: "Login",
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "30d",
    });
    setAuthCookie(res, token);

    return res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.redirect("/login");
  } catch (err) {
    next(err);
  }
};
