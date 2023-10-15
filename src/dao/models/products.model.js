import { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
});

export const productsModel = model("Products", productSchema);
