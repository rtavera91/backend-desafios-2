import mongoose from "mongoose";
import config from "../src/config/config.js";

const URI = config.mongo_uri;

mongoose
  .connect(URI)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));
