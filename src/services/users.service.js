import { usersManager } from "../dao/managers/usersManager.js";
import { hashData, compareData } from "../utils.js";
import passport from "passport";
import config from "../config/config.js";

export const findAll = async () => {
  try {
    const users = await usersManager.findAll();
    return users;
  } catch (error) {
    throw error;
  }
};

export const findById = async (id) => {
  try {
    const user = await usersManager.findById(id);
    return user;
  } catch (error) {
    throw error;
  }
};

export const createOne = async (user) => {
  const hashedPassword = hashData(user.password);
  const userCreated = await usersManager.createOne({
    ...user,
    password: hashedPassword,
  });
  const response = {
    welcome_string: `Welcome ${userCreated.name}!`,
    email: userCreated.email,
    password: userCreated.password,
  };
  return response;
};

export const updateOne = async (id, user) => {
  try {
    const userUpdated = await usersManager.updateOne(id, user);
    return userUpdated;
  } catch (error) {
    throw error;
  }
};

export const deleteOne = async (id) => {
  try {
    const result = await usersManager.deleteOne(id);
    return result;
  } catch (error) {
    throw error;
  }
};

export const findByEmail = async (email) => {
  try {
    const user = await usersManager.findByEmail(email);
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateLastConnection = async (email) => {
  try {
    const updatedUser = await usersManager.updateLastConnection(email);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const getInactiveUsers = async () => {
  try {
    const inactiveUsers = await usersManager.getInactiveUsers();
    return inactiveUsers;
  } catch (error) {
    throw error;
  }
};
