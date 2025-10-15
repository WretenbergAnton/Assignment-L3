import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";

/**
 * Controller for authentication operations.
 * Handles user registration, login, and logout.
 */
export class AuthController {
  /**
   * Set authentication cookie
   */
  #setAuthCookie(res, token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ms(JWT_EXPIRES_IN || "30d"),
    });
  }

  /**
   * Generate JWT token for user
   */
  #generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "30d",
    });
  }

  /**
   * Hash password
   */
  async #hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Verify password
   */
  async #verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Handle user registration
   */
  async signUp(req, res, next) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.render("auth/sign-up", {
          title: "Register",
          error: "Please fill in all fields",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render("auth/sign-up", {
          title: "Register",
          error: "Email is already in use",
        });
      }

      const hashedPassword = await this.#hashPassword(password);
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      const token = this.#generateToken(user._id);
      this.#setAuthCookie(res, token);

      return res.redirect("/dashboard");
    } catch (err) {
      next(err);
    }
  }

  /**
   * Handle user login
   */
  async signIn(req, res, next) {
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

      const isPasswordValid = await this.#verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.render("auth/sign-in", {
          title: "Login",
          error: "Invalid credentials",
        });
      }

      const token = this.#generateToken(user._id);
      this.#setAuthCookie(res, token);

      return res.redirect("/dashboard");
    } catch (err) {
      next(err);
    }
  }

  /**
   * Handle user logout
   */
  signOut(req, res, next) {
    try {
      res.clearCookie("token");
      return res.redirect("/login");
    } catch (err) {
      next(err);
    }
  }
}