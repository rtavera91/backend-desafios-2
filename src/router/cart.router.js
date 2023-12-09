import { Router } from "express";
import { cartsManager } from "../dao/managers/cartManager.js";
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
    const cart = await cartsManager.findById(cid); // Pasa el ID del carrito
    if (cart) {
      res.status(200).json({ message: "Cart found", cart });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// agregar producto a carrito existente
router.post("/cart/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity, 10);
  try {
    const updatedCart = await cartsManager.updateOne(cid, pid, quantity);
    if (updatedCart) {
      res
        .status(200)
        .json({ message: "Product added to cart", cart: updatedCart });
    } else {
      res.status(404).json({ message: "Cart or Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//elimina de un carrito, un producto seleccionado
router.delete("/cart/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartsManager.deleteProduct(cid, pid);
    if (updatedCart) {
      res
        .status(200)
        .json({ message: "Product deleted from cart", cart: updatedCart });
    } else {
      res.status(404).json({ message: "Cart or Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// modificamos la cantidad de un producto en un carrito
router.put("/cart/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity, 10);
  try {
    const updatedCart = await cartsManager.updateOne(cid, pid, quantity);
    res
      .status(200)
      .json({ message: "Product quantity updated", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const cartRouter = router;
