import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 8080,
  mongo_uri: process.env.MONGO_URI,
  session_secret: process.env.SESSION_SECRET,
  jwt_secret: process.env.JWT_SECRET,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  gmail_user: process.env.GMAIL_USER,
  gmail_password: process.env.GMAIL_PASSWORD,
};
