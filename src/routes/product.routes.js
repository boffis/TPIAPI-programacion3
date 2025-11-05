import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct, getProductsAdmin } from "../services/product.services.js";

const router = Router();

router.post("/product", verifyToken, createProduct);

router.put("/product/:id", verifyToken, updateProduct)

router.delete("/product/:id", verifyToken, deleteProduct)

router.get("/products", getProducts)

router.get("/products/admin",verifyToken , getProductsAdmin)

router.get("/product/:id", verifyToken, getProductById)


export default router;