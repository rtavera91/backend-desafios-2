// Cart service se comunica con el manager de cart, que a su vez se comunica con el modelo de cart.
import { cartsManager } from "../dao/managers/cartManager.js";

export const findAll = async () => {
  try {
    const carts = await cartsManager.findAll();
    return carts;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while finding all carts" };
  }
};

export const findById = async (id) => {
  try {
    const cart = await cartsManager.findById(id);
    return cart;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while finding cart by ID" };
  }
};

export const createOne = async (...products) => {
  try {
    const cart = await cartsManager.createOne(...products);
    return cart;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while creating cart" };
  }
};

export const updateOne = async (cid, pid, quantity) => {
  try {
    const cart = await cartsManager.updateOne(cid, pid, quantity);
    return cart;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while updating cart" };
  }
};

export const deleteOne = async (id) => {
  try {
    const result = await cartsManager.deleteOne(id);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting cart" };
  }
};

export const deleteProduct = async (cid, pid) => {
  try {
    const result = await cartsManager.deleteProduct(cid, pid);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting product from cart" };
  }
};

export const deleteAllProducts = async (cid) => {
  try {
    const result = await cartsManager.deleteAllProducts(cid);
    return result;
  } catch (error) {
    console.error(error.message);
    return { error: "Error while deleting all products from cart" };
  }
};
