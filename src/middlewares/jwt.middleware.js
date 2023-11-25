import jwt from "jsonwebtoken";
const JWT_SECRET = "jwtSECRET";

export const jwtValidation = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token missing in Authorization header" });
    }

    const responseToken = jwt.verify(token, JWT_SECRET);
    req.user = responseToken;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
