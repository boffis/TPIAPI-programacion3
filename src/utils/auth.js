import jwt from 'jsonwebtoken'
import secretKey from './key.js';
export const verifyToken = (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];

    if (!token)
        return res.status(401).send({ message: "authorization required" });

    try {
        const payload = jwt.verify(token, secretKey);
            
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).send({ message: "wrong permits" })
    }
}
