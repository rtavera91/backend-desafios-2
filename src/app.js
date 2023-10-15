//importación de express y la clase ProductManager
import express from "express";
import { viewsRouter } from "./router/views.router.js";
import { Server } from "socket.io";
import { productsRouter } from "./router/products.router.js";
import { cartRouter } from "./router/cart.router.js";
import { usersRouter } from "./router/users.router.js";
import { chatsRouter } from "./router/chats.router.js";
import { __dirname } from "./utils.js";
import { productsManager } from "../src/dao/db/managers/productManager.js";
import "./dao/configDB.js";
import handlebars from "express-handlebars";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/router/views");
app.set("view engine", "handlebars");

//routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);
app.use("/api/chat", chatsRouter);

// levantamos al servidor

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}...`);
});

// websocket - server
const socketServer = new Server(httpServer);

// productsManager
//   .findAll()
//   .then((initialProducts) => {
//     const products = initialProducts;
//     socketServer.on("connection", (socket) => {
//       console.log("Nuevo cliente conectado!");
//       socket.emit("new-product-list", products);

//       socket.on("new-product", (data) => {
//         console.log("Nuevo producto recibido!");
//         products.push(data);
//         socketServer.emit("new-product-list", products);
//       });
//     });
//   })
//   .catch((error) => {
//     console.error("Error al cargar los archivos", error);
//   });

const messages = [];
socketServer.on("connection", (socket) => {
  socket.on("new-message", (data) => {
    messages.push(data);
    socketServer.emit("messages", messages);
  });
});
