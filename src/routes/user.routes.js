import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import { login, register, getAllUsers, getUserById, deleteUser, updateUser  } from "../services/user.services.js";

const router = Router();



router.post("/login", login);


router.post("/register", register)



router.get("/users", verifyToken, getAllUsers)

router.get("/users/:id", verifyToken, getUserById);

router.put("/users/:id", verifyToken, updateUser);

router.delete("/users/:id", verifyToken, deleteUser);


export default router;