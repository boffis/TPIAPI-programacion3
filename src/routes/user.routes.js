import { Router } from "express";
import { verifyToken } from "../utils/auth.js";
import { login, register, getAllUsers, getUserById, deleteUser, updateUser  } from "../services/user.services.js";

const router = Router();



router.post("/login", login);


router.post("/register", register)



router.get("/users", verifyToken, getAllUsers)

router.get("/user/:id", verifyToken, getUserById);

router.put("/user/:id", verifyToken, updateUser);

router.delete("/user/:id", verifyToken, deleteUser);


export default router;