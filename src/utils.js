import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./config/config.js";

export const __dirname = dirname(fileURLToPath(import.meta.url));

const JWT_SECRET = config.jwt_secret;

//bcrypt
export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
  return bcrypt.compare(data, hashedData);
};

//jwt
export const generateToken = (data) => {
  return jwt.sign(data, JWT_SECRET);
};
