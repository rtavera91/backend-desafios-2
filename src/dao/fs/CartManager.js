//agregamos file system al proyecto
import fs from "fs";
import { productManager } from "./ProductManager.js";

// clase constructora del carrito

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // método para traer los carritos del archivo
  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  // método para crear carrito usando ID autoincrementable
  async addCart(...productID) {
    try {
      const carts = await this.getCarts();
      if (productID.length === 0) {
        return console.log("error: No product IDs provided");
      }

      const productsToAdd = [];

      for (let i = 0; i < productID.length; i++) {
        const product = await productManager.getProductById(productID[i]);
        if (product.error === "Product Not Found") {
          console.log(
            `error: Product with ID ${productID[i]} not found. Please provide a valid Product ID`
          );
        } else {
          productsToAdd.push(product);
        }
      }

      if (productsToAdd.length === 0) {
        return console.log("error: No valid product IDs provided");
      }

      const cart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: productsToAdd,
      };
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      return error;
    }
  }

  // método para obtener un carrito por su id
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      return (
        carts.find((cart) => cart.id == id) || {
          error: "Cart Not Found",
        }
      );
    } catch (error) {
      return error;
    }
  }

  // método para agregar productos a un carrito
  async addProductToCart(id, productID, quantity = 1) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id == id);
      if (cartIndex === -1) {
        return { error: "Cart Not Found" };
      }

      const product = await productManager.getProductById(productID);
      if (product.error === "Product Not Found") {
        return console.log(
          `error: Product with ID ${productID} not found. Please provide a valid Product ID`
        );
      } else if (quantity <= 0) {
        return console.log("error: Quantity must be greater than 0");
      } else if (quantity > product.stock) {
        return console.log(
          `error: Not enough stock. Available: ${product.stock}`
        );
      }

      // Verifica si el producto ya existe en el carrito
      const existingProductIndex = carts[cartIndex].products.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex === -1) {
        // Si el producto no está en el carrito, lo agregamos con la cantidad proporcionada
        carts[cartIndex].products.push({
          ...product,
          quantity,
        });
      } else {
        // Si el producto ya está en el carrito, incrementamos la cantidad existente
        carts[cartIndex].products[existingProductIndex].quantity += quantity;
      }

      // Guarda el carrito actualizado en el archivo
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      return error;
    }
  }
}

export const cartManager = new CartManager("cartsAPI.json");
