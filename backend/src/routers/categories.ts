import { Request, Response, Router } from "express";
import { ICategory } from "../models/category";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "../DB/queries/categories";
import { IMessage } from "../models/message";

const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  async (req: Request, res: Response<ICategory[] | IMessage>) => {
    try {
      const categories = await getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories", error });
    }
  }
);

categoriesRouter.post(
  "/add",
  async (req: Request<{}, {}, ICategory>, res: Response<IMessage>) => {
    try {
      const { name } = req.body;
      await addCategory(name);
      res.status(201).json({ message: "Category added successfully" });
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ message: "Failed to add category", error });
    }
  }
);

categoriesRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<IMessage>) => {
    try {
      const { id } = req.params;
      await deleteCategory(Number(id));
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category", error });
    }
  }
);

export default categoriesRouter;
