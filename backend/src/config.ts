import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};
