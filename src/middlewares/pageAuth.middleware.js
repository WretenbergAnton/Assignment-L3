import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js"
import User from "../models/user.model.js"

export async function requireAuthPage(req, res, next) {
  try {
    const token = req.cookies?.token
    if (!token) return res.redirect("/login")
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).lean()
    if (!user) return res.redirect("/login")

    req.user = user
    next()
  } catch {
    return res.redirect("/login")
  }
}
