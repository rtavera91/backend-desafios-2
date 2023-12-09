import { Router } from "express";
import { messagesManager } from "../dao/managers/messageManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await messagesManager.findAll();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const message = await messagesManager.createOne(req.body);
    if (!name || !email || !message) {
      res.status(400).json({ message: "Missing fields" });
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const chatsRouter = router;
