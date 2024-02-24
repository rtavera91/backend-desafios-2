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

  async updateLastConnection(email) {
    try {
      const updatedUser = await usersModel.updateOne(
        { email: email },
        { $set: { last_connection: new Date() } },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async getInactiveUsers() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const inactiveUsers = await usersModel.find({
      last_connection: {
        $ne: null,
        $lt: twoDaysAgo,
      },
    });

    return inactiveUsers;
  }
}

export const usersManager = new UsersManager(usersModel);
