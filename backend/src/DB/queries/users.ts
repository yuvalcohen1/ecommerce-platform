import { RowDataPacket, ResultSetHeader } from "mysql2";
import { IUser } from "../../models/user";
import { db } from "../db";

type DbQueryResult<TableRecord> = (TableRecord & RowDataPacket)[];

export async function getAllUsers(): Promise<IUser[]> {
  const [users] = await db.query<DbQueryResult<IUser>>("SELECT * FROM users");
  return users;
}

export async function getUserById(userId: string): Promise<IUser | null> {
  const [users] = await db.query<DbQueryResult<IUser>>(
    "SELECT * FROM users WHERE id = ?",
    [userId]
  );

  if (users.length === 0) {
    return null;
  }

  return users[0];
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const [users] = await db.query<DbQueryResult<IUser>>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    return null;
  }

  return users[0];
}

export async function createUser({
  email,
  password_hash,
  name,
}: IUser): Promise<number> {
  const [{ insertId }] = await db.query<ResultSetHeader>(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, password_hash, name]
  );

  return insertId;
}
