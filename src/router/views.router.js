import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export const viewsRouter = router;
