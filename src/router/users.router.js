import { Router } from "express";
import { usersManager } from "../dao/db/managers/usersManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await usersManager.findAll();
    res.status(200).json({ message: "Users", users });
  } catch (error) {
    res.status(500).json({ error: "Error", error });
  }
});

router.get("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const user = await usersManager.findById(idUser);
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ error: "Error", error });
  }
});

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const createdUser = await usersManager.createOne(req.body);
    res.redirect(`/index/${createdUser._id}`);
  } catch (error) {
    res.status(500).json({ error: "Error", error });
  }
});

export const usersRouter = router;
