import { Router } from "express";
import { productsManager } from "../dao/db/managers/productManager.js";
const router = Router();

router.get("/", (req, res) => {
  res.send("Bienvenido al servidor de productos");
});

// get de todos los productos con opción para poner un límite
router.get("/products/", async (req, res) => {
  try {
    const { limit, sort, page, query } = req.query;
    const limitValue = limit ? parseInt(limit) : 10;
    let sortBy = null;
    const endpoint = "http://localhost:8080/api/products/products";

    if (sort) {
      sortBy = sort === "asc" ? "price" : `-${sort === "desc" ? "price" : ""}`;
    }

    const products = await productsManager.findAll({
      limit: limitValue,
      sort: sortBy,
      page,
      query,
      endpoint,
    });
    if (!products.results.length) {
      res.status(200).json({ message: "No Products Found" });
    } else {
      res.status(200).json({
        message: "Products found",
        info: products.info,
        products: products.results,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get de un producto por su id
router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productsManager.findById(pid);

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
    stock = 0,
    category,
    thumbnail,
  } = req.body;
  if (!title || !description || !code || !price) {
    res.status(400).json({ message: "All fields are required" });
  } else if (!stock) {
    delete req.body.stock;
  } else {
    try {
      const createdProduct = await productsManager.createOne(req.body);
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
    await productsManager.updateOne(
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
    await productsManager.deleteOne(pid);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const productsRouter = router;
