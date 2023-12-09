import { Router } from "express";
import { __dirname } from "../utils.js";
import { usersManager } from "../dao/managers/usersManager.js";
import { productsManager } from "../dao/managers/productManager.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

// error
router.get("/error", (req, res) => {
  res.render("error");
});

router.get("/index/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const userInfo = await usersManager.findById(idUser);
  const { first_name, last_name, email } = userInfo;
  res.render("index", { first_name, last_name, email });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/products", async (req, res) => {
  try {
    const { limit, sort, page, query } = req.query;
    const limitValue = limit ? parseInt(limit) : 10;
    let sortBy = null;
    const endpoint = "http://localhost:8080/api/products/products";

    if (sort) {
      sortBy = sort === "asc" ? "price" : `-${sort === "desc" ? "price" : ""}`;
    }

    //accedemos al nombre & email de la sesión
    const email = req.session.email;
    const first_name = req.session.first_name;

    const productsData = await productsManager.findAll({
      limit: limitValue,
      sort: sortBy,
      page,
      query,
      endpoint,
    });

    const { info, results } = productsData;
    const { hasPrevPage, hasNextPage, prev, next } = info;

    res.render("products", {
      products: results,
      hasPrevPage,
      hasNextPage,
      prev,
      next,
      email,
      first_name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//vista de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsManager.findById(pid);

    if (product.error === "Product Not Found") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.render("product", { product });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const viewsRouter = router;
