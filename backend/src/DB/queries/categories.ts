import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../db";
import { ICategory } from "../../models/category";

type ICategoryRow = ICategory & RowDataPacket;

export async function getCategories(): Promise<ICategory[]> {
  const [categories] = await db.query<ICategoryRow[]>(
    "SELECT * FROM categories"
  );
  return categories;
}

export async function addCategory(name: string): Promise<number> {
  const [{ insertId }] = await db.query<ResultSetHeader>(
    "INSERT INTO categories (name) VALUES (?);",
    [name]
  );

  return insertId;
}

export async function deleteCategory(id: number) {
  await db.query<ResultSetHeader>("DELETE FROM categories WHERE id = ?", [id]);
}
