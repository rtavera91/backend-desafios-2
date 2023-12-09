import { cartsModel } from "../models/carts.model.js";
import mongoose from "mongoose";

class CartsManager {
  //con este método mandamos todos los carrito y los productos que contienen
  async findAll() {
    const carts = await cartsModel.find().populate("products").exec();
    return carts;
  }

  //con este método mandamos un carrito encontrado por su id y los productos que contiene
  async findById(id) {
    const cart = await cartsModel.findById(id).populate("products");
    return cart;
  }

  //con este método creamos un carrito
  async createOne(...products) {
    const cart = await cartsModel.create({ products });
    return cart;
  }

  //con este método agregamos un producto a un carrito
  async updateOne(cid, pid, quantity) {
    const cart = await cartsModel.findById(cid);
    const product = await cartsModel.findById(pid);

    console.log("CID:", cid);
    console.log("PID:", pid);
    console.log("Quantity:", quantity);

    if (cart && product) {
      // Busca el producto en el carrito para actualizar su cantidad
      const productInCart = cart.products.find(
        (item) => item.product.toString() === pid
      );

      if (productInCart) {
        // Actualiza la cantidad si el producto ya está en el carrito
        productInCart.quantity = quantity;
      } else {
        // Agrega el producto al carrito con la cantidad especificada
        cart.products.push({ product: pid, quantity });
      }

      await cart.save();
      return cart;
    } else {
      return { error: "Cart or Product not found" };
    }
  }

  //con este método eliminamos un carrito
  async deleteOne(id) {
    const cart = await cartsModel.findById(id);
    if (cart) {
      await cart.remove();
      return cart;
    } else {
      return { error: "Cart not found" };
    }
  }

  //con este método eliminamos un producto de un carrito
  async deleteProduct(cid, pid) {
    const cart = await cartsModel.findById(cid);
    const product = await cartsModel.findById(pid);
    if (cart && product) {
      cart.products.pull(product);
      await cart.save();
      return cart;
    } else {
      return { error: "Cart or Product not found" };
    }
  }

  //borramos todos los productos de un carrito
  async deleteAllProducts(cid) {
    const cart = await cartsModel.findById(cid);
    if (cart) {
      cart.products = [];
      await cart.save();
      return cart;
    } else {
      return { error: "Cart not found" };
    }
  }
}

export const cartsManager = new CartsManager();
