import { Schema, model } from "mongoose";

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
    enum: ["admin", "premium", "client"],
    default: "client",
  },
});

export const usersModel = model("Users", userSchema);
