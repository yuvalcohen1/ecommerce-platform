import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing required database environment variables.");
}

export const db = mysql.createPool({
  multipleStatements: true,
  host: DB_HOST,
  port: Number(process.env.DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});
