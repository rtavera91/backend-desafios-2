import {
  findAll,
  findById,
  createOne,
  updateOne,
  deleteOne,
  deleteAllProducts,
  deleteProduct,
} from "../services/carts.service.js";

export const findCarts = async (req, res) => {
  const carts = await findAll();
  if (!carts.length) {
    res.status(200).json({ message: "No Carts Found" });
  } else {
    res.status(200).json({ message: "Carts found", carts });
  }
};

export const findCartById = async (req, res) => {
  const { cid } = req.params;
  const cart = await findById(cid); // Pasa el ID del carrito
  if (cart) {
    res.status(200).json({ message: "Cart found", cart });
  } else {
    res.status(404).json({ message: "Cart not found" });
  }
};

export const createCart = async (req, res) => {
  const { productID } = req.body;
  const createdCart = await createOne(...productID);
  if (createdCart) {
    res.status(200).json({ message: "Cart created", cart: createdCart });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCart = async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity, 10);
  try {
    const updatedCart = await updateOne(cid, pid, quantity);
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
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await deleteOne(cid);
    if (result) {
      res.status(200).json({ message: "Cart deleted" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartProduct = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await deleteProduct(cid, pid);
    if (updatedCart) {
      res.status(200).json({ message: "Product deleted from cart" });
    } else {
      res.status(404).json({ message: "Cart or Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartProducts = async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await deleteAllProducts(cid);
    if (result) {
      res.status(200).json({ message: "Cart products deleted" });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
