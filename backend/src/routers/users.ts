import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, UserRole } from "../models/user";
import { IMessage } from "../models/message";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
} from "../DB/queries/users";
import { ILogin, ISignup } from "../models/auth";
import { config } from "../config";
import { isValidEmail, isValidPassword } from "../utils/validators";

const usersRouter = Router();

// Get all users
usersRouter.get(
  "/",
  async (req: Request, res: Response<IUser[] | IMessage>) => {
    try {
      const users: IUser[] = await getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users", error });
    }
  }
);

// Get user by ID
usersRouter.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<IUser | IMessage>) => {
    try {
      const userId = req.params.id;
      const user = await getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  }
);

// Sign up
usersRouter.post(
  "/signup",
  async (
    req: Request<{}, {}, ISignup>,
    res: Response<{ token: string } | IMessage>
  ) => {
    try {
      const { name, email, password, role } = req.body;
      if (!email || !password || !name || !role) {
        return res
          .status(400)
          .json({ message: "Email, password, name or role is missing" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and contain both letters and numbers",
        });
      }

      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of hashing

      // Create the new user
      const newUserId = await createUser({
        email,
        password_hash: hashedPassword,
        name,
        role,
      });

      if (!config.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(
        { userId: newUserId, email: email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour expiration
        sameSite: "strict", // Prevent CSRF attacks
      });
      return res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Login
usersRouter.post(
  "/login",
  async (
    req: Request<{}, {}, ILogin>,
    res: Response<{ token: string } | IMessage>
  ) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email or password is missing" });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!config.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour expiration
        sameSite: "strict", // Prevent CSRF attacks
      });

      return res.json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Logout
usersRouter.post("/logout", (req: Request, res: Response<IMessage>) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.json({ message: "Logged out successfully" });
});

// Delete user
usersRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<IMessage>) => {
    try {
      const { id } = req.params;
      await deleteUser(Number(id));
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("User deletion error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default usersRouter;
