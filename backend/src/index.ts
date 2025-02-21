import express from "express";
import { config } from "./config";
import usersRouter from "./routers/users";

const app = express();
app.use(express.json());

app.use("/users", usersRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
