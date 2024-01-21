import { usersModel } from "../models/users.model.js";
import BasicManager from "./basicManager.js";

class UsersManager extends BasicManager {
  constructor(model) {
    super(model);
  }

  async findAll() {
    const response = await usersModel.find();
    return response;
  }

  async findByEmail(email) {
    const response = await usersModel.findOne({ email });
    return response;
  }
}

export const usersManager = new UsersManager(usersModel);
