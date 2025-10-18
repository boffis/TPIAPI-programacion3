import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from "../services/product.services.js";

const router = Router();

router.post("/product", verifyToken, createProduct);

router.put("/product/:id", verifyToken, updateProduct)

router.delete("/product/:id", verifyToken, deleteProduct)

router.get("/product", getProducts)

router.get("/product/:id", verifyToken, getProductById)


export default router;