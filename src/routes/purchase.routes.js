import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import { getPurchase, makePurchase, deletePurchase } from "../services/purchase.services.js"
const router = Router();

router.post("/purchase", verifyToken, makePurchase);

router.put("/purchase/:id", verifyToken, getPurchase)

router.delete("/purchase/:id", verifyToken, deletePurchase)

export default router;