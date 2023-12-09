//importación de express y la clase ProductManager
import express from "express";
import { viewsRouter } from "./router/views.router.js";
import { Server } from "socket.io";
import { productsRouter } from "./router/products.router.js";
import { cartRouter } from "./router/cart.router.js";
import { usersRouter } from "./router/users.router.js";
import { chatsRouter } from "./router/chats.router.js";
import { __dirname } from "./utils.js";
import { productsManager } from "../src/dao/managers/productManager.js";
import config from "./config/config.js";
import "./config/configDB.js";
import handlebars from "express-handlebars";
import session from "express-session"; // para manejar sesiones
import MongoStore from "connect-mongo"; // para guardar las sesiones en la base de datos
import "./config/configDB.js"; // para conectar a la base de datos
import cookieParser from "cookie-parser";
import sessionsRouter from "./router/sessions.router.js";

//importar passport y la configuración de passport
import "./passport.js";
import passport from "passport";

const app = express();

app.use(cookieParser()); // para poder usar req.cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// configuración de la sesión en mongo
const URI = config.mongo_uri;
app.use(
  session({
    secret: config.session_secret,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hora,
    },
    store: new MongoStore({
      mongoUrl: URI,
    }),
  })
);

// inicializamos passport
app.use(passport.initialize());
app.use(passport.session());

// configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/router/views");
app.set("view engine", "handlebars");

// configuración de recursos estáticos
app.use(express.static(__dirname + "/public"));

//routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);
app.use("/api/chat", chatsRouter);
app.use("/api/sessions", sessionsRouter);

// levantamos al servidor

const PORT = config.port;
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
