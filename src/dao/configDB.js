import mongoose from "mongoose";

const URI =
  "mongodb+srv://bxrodrigo61:coderhouse@codercluster.djisdxv.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose
  .connect(URI)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));
