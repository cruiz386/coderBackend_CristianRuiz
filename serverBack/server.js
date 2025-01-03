import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import __dirname from "./utils.js";
import socketCb from "./src/routers/index.socket.js";
import dbConnect from "./src/utils/db.utils.js";
 
try {
  const server = express();
  const PORT = process.env.PORT || 8080;

  const ready = async () => {
    console.log("Server ready on port " + PORT);
    await dbConnect();
  }

  const httpServer = createServer(server);
  const tcpServer = new Server(httpServer);
 
  tcpServer.on("connection", socketCb);
 
  httpServer.listen(PORT, ready);

  // Middleware
  server.use(morgan("dev"));
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use(cors());
  server.use("/public", express.static("public"));


  // Configuración de handlebars
  server.engine("handlebars", engine());
  server.set("view engine", "handlebars");
  server.set("views", __dirname + "/src/views");

  // Rutas
  server.use(router);

  // Manejo de errores
  server.use(pathHandler);
  server.use(errorHandler);



} catch (error) {
  console.log(error);
}
