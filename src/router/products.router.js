import { Router } from "express";
import { productManager } from "../ProductManager.js";
const router = Router();

router.get("/", (req, res) => {
  res.send("Bienvenido al servidor de productos");
});

// get de todos los productos con opción para poner un límite
router.get("/products/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if (!products.length) {
      res.status(200).json({ message: "No Products Found" });
    } else {
      if (limit) {
        res.status(200).json(products.slice(0, limit));
      } else {
        res.status(200).json({ message: "Products found", products });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get de un producto por su id
router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);

    if (product.error === "Product Not Found") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product found", product });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// post de un producto
router.post("/products/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnail,
  } = req.body;
  if(!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({message: 'All fields are required'});
  } else {
    try {
      await productManager.addProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
      );
      res.status(200).json({ message: "Product created" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// put de un producto por su id
router.put("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;
  try {
    await productManager.updateProductById(
      pid,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    );
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete de un producto por su id
router.delete("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const productsRouter = router;
