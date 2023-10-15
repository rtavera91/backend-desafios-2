import { cartsModel } from "../../models/carts.model.js";
import BasicManager from "./basicManager.js";

class CartsManager extends BasicManager {
  constructor() {
    super(cartsModel);
  }
}

export const cartsManager = new CartsManager();
