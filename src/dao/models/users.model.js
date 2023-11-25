import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100,
    min: 3,
  },
  last_name: {
    type: String,
    required: true,
    max: 100,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 3,
  },
  from_github: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "premium", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
});

export const usersModel = model("Users", userSchema);
