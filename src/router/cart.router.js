import { Router } from "express";
import { cartsManager } from "../dao/db/managers/cartManager.js";
const router = Router();

// obtener los carritos
router.get("/cart", async (req, res) => {
  try {
    const carts = await cartsManager.findAll();
    if (!carts.length) {
      res.status(200).json({ message: "No Carts Found" });
    } else {
      res.status(200).json({ message: "Carts found", carts });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// crear carrito
router.post("/cart", async (req, res) => {
  const { productID } = req.body;
  try {
    await cartsManager.createOne(...productID);
    res.status(200).json({ message: "Cart created" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// obtener carrito por id
router.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await cartsManager.findById();
    const cart = carts.find((cart) => cart.id == cid);
    if (cart.error === "Cart Not Found") {
      res.status(404).json({ message: "Cart not found" });
    } else {
      res.status(200).json({ message: "Cart found", cart });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// agregar producto a carrito existente
router.post("/cart/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity, 10); // Convierte el valor en un número
  try {
    await cartsManager.updateOne(cid, pid, quantity);
    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const cartRouter = router;
