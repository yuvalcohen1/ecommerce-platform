import express from "express";
import cors from "cors";
import { config } from "./config";
import usersRouter from "./routers/users";
import categoriesRouter from "./routers/categories";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
