import "express-async-errors";
import express, { json } from "express";
import { routes } from "./routes/index.js";
import { AppError } from "./utils/AppError.js";
import { MigrationsRun } from "./database/sqlite/migrations/index.js";

const app = express();
const PORT = 3333;

app.use(json());
app.use(routes);

MigrationsRun();

app.use(( error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.log(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));