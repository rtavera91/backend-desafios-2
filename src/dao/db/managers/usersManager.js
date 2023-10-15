import { usersModel } from "../../models/users.model.js";
import BasicManager from "./basicManager.js";

class UsersManager extends BasicManager {
  constructor(model) {
    super(model);
  }
}

export const usersManager = new UsersManager(usersModel);
