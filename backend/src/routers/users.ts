import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user";
import { IError } from "../models/error";
import {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
} from "../DB/queries/users";
import { ILogin, ISignup } from "../models/auth";
import { config } from "../config";
import { isValidEmail, isValidPassword } from "../utils/validators";

const usersRouter = Router();

// Get all users
usersRouter.get("/", async (req: Request, res: Response<IUser[] | IError>) => {
  try {
    const users: IUser[] = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// Get user by ID
usersRouter.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<IUser | IError>) => {
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
    res: Response<{ token: string } | IError>
  ) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ message: "Email, password, or name is missing" });
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
      });

      if (!config.JWT_SECRET) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign(
        { userId: newUserId, email: email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({ token });
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
    res: Response<{ token: string } | IError>
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

      return res.json({ token });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default usersRouter;
