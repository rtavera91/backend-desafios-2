import { productsManager } from "../dao/managers/productManager.js";

export const findAll = async () => {
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
    return products;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findById = async (id) => {
  const { pid } = req.params;
  try {
    const product = await productsManager.findById(pid);

    if (product.error === "Product Not Found") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product found", product });
    }
    return product;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOne = async (product) => {
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
      return createdProduct;
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateOne = async (id, product) => {
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
    const updatedProduct = await productsManager.updateOne(
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
    return updatedProduct;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOne = async (id) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await productsManager.deleteOne(pid);
    res.status(200).json({ message: "Product deleted" });
    return deletedProduct;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const findByCategory = async (category) => {
//   const { category } = req.query;
//   try {
//     const products = await productsManager.findByCategory(category);
//     if (!products.length) {
//       res.status(200).json({ message: "No Products Found" });
//     } else {
//       res.status(200).json({ message: "Products found", products });
//     }
//     return products;
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
