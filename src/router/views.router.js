import { Router } from "express";
import { __dirname } from "../utils.js";
import { usersManager } from "../dao/db/managers/usersManager.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("signup");
});

router.get("/index/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const userInfo = await usersManager.findById(idUser);
  const { first_name, last_name, email } = userInfo;
  res.render("index", { first_name, last_name, email });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

export const viewsRouter = router;
