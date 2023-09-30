//importación de express y la clase ProductManager
import express from "express";
import { engine } from "express-handlebars";
import { viewsRouter } from "./router/views.router.js";
import { Server } from "socket.io";
import { productsRouter } from "./router/products.router.js";
import { cartRouter } from "./router/cart.router.js";
import { __dirname } from "./utils.js";
import { productManager } from "./ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// configuración de handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

//routes
app.use("/api", productsRouter);
app.use("/api", cartRouter);

// levantamos al servidor

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}...`);
});

// websocket - server
const socketServer = new Server(httpServer);

productManager
  .getProducts()
  .then((initialProducts) => {
    const products = initialProducts;
    socketServer.on("connection", (socket) => {
      console.log("Nuevo cliente conectado!");
      socket.emit("new-product-list", products);

      socket.on("new-product", (data) => {
        console.log("Nuevo producto recibido!");
        products.push(data);
        socketServer.emit("new-product-list", products);
      });
    });
  })
  .catch((error) => {
    console.error("Error al cargar los archivos", error);
  });
