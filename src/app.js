//importación de express y la clase ProductManager
import express from "express";
import { productsRouter } from "./router/products.router.js";
import { cartRouter } from "./router/cart.router.js";
import { __dirname } from "./utils.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));

//routes
app.use("/api", productsRouter);
app.use("/api", cartRouter);

// levantamos al servidor
app.listen(8080, () => {
  console.log("Escuchando al puerto 8080");
});

