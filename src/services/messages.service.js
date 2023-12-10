import { messagesManager } from "../dao/managers/messageManager.js";

export const findAll = async () => {
  try {
    const messages = await messagesManager.findAll();
    return messages;
  } catch (error) {
    throw error;
  }
};

export const createOne = async (message) => {
  try {
    const messageCreated = await messagesManager.createOne(message);
    return messageCreated;
  } catch (error) {
    throw error;
  }
};
