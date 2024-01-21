import { productsModel } from "../models/products.model.js";
import BasicManager from "./basicManager.js";

class ProductsManager extends BasicManager {
  constructor() {
    super(productsModel);
  }

  async findAll() {
    const response = await productsModel.find();
    return response;
  }
}

export const productsManager = new ProductsManager();
