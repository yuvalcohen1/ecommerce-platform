import express, { Request, Response } from "express";
import { config } from "./config";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
