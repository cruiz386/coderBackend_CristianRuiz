import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";

try {
  const server = express();
  const PORT = 8080;
  const ready = () => console.log("server ready on port " + PORT);
  server.listen(PORT, ready);

  server.use(morgan("dev"));
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  server.use(cors());

  server.use(router);
  server.use(errorHandler);
  server.use(pathHandler);
} catch (error) {
  console.log(error);
}