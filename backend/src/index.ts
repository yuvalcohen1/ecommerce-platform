import express, { Request, Response } from "express";
import { config } from "./config";
import db from "./db";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database query error");
  }
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
