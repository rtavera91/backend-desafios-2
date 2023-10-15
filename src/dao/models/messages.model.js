import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 100,
    min: 3,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const messagesModel = model("Messages", messageSchema);
