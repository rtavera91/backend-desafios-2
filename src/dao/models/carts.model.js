import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsInCartSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products", // Referencia al modelo de productos
  },
  quantity: {
    type: Number,
    default: 1, // Valor predeterminado de 1
  },
});

const cartSchema = new Schema({
  date_created: {
    type: Date,
    default: Date.now(),
  },
  products: [productsInCartSchema],
});

cartSchema.plugin(mongoosePaginate);

export const cartsModel = model("Carts", cartSchema);
