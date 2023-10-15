import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  date_created: {
    type: Date,
    default: Date.now(),
  },
  products: {
    type: Array,
    required: true,
  },
});

export const cartsModel = model("Carts", cartSchema);
