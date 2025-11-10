import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import { validateEmail, validatePassword, validateDNI, validateUsername } from "../utils/validations.js";

import { User } from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import { Product } from "../models/Product.js";

import secretKey from '../utils/key.js';

export const register = async (req, res) => {
    try {
        
        const { username, email, password, dni } = req.body;
        
        if (!validateEmail(email)){
            return res.status(400).json({ message: "invalid email" });
        } else if (!validatePassword(password)){
            return res.status(400).json({ message: "invalid password" });
        } else if (!validateUsername(username)){
            return res.status(400).json({ message: "invalid username" });
        } else if (!validateDNI(dni)){
            return res.status(400).json({ message: "invalid dni" });
        }   
        console.log("REGISTER RAN VALIDATIONS")
        let user = await User.findOne({
            where: {
                [Op.or]: [ {dni}, {email},  {username} ]
                
            }
        });
        console.log("REGISTER SEARCHED USER")
        
        
        if (user && !user.deleted){
            if(user.username === username)
                return res.status(400).json({ message: "used username" });
            if(user.email === email)
                return res.status(400).json({ message: "used email" });
            return res.status(400).json({ message: "used dni" });
        }
        
        const saltRounds = 10;
        
        const salt = await bcrypt.genSalt(saltRounds);
        
        const hashedPassword = await bcrypt.hash(password, salt);

        // Already inserted Sysadmin
        let status = "Buyer";

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            dni,
            status
        })
        
        res.json(newUser.id);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const resultEmail = validateEmail(email);
    if (!resultEmail)
        return res.status(401).send({ message: "invalid email" });

    const user = await User.findOne({
        where: {
            email
        },
        include: [{model:Purchase, include: Product}, {model:Product}]
    });

    if (!user || user.deleted )
        return res.status(401).send({ message: "no user with that email" });

    
    const comparison = await bcrypt.compare(password, user.password);



    if (!comparison)
        return res.status(401).send({ message: "wrong password" });


    const token = jwt.sign({ id: user.id, email, status:user.status }, secretKey, { expiresIn: "1h" });

    return res.json({
        token, 
        id: user.id, 
        username:user.username,
        email,
        status: user.status, 
        purchases: user.purchases, 
        products: user.products });
};


export const getAllUsers = async (req, res) => {
    try {

        const {status} = req.user;
        if (status !== "SysAdmin")
            return res.status(403).json({ message: "insufficient permissions" });

        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{model:Purchase, include:Product}, {model:Product}]
        });
        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const getUserById = async (req, res) => {
    try {

        const {status, id} = req.user;
        let relations
        status === "SysAdmin" || id === req.params.id ? relations = [{model:Purchase, include:Product}, {model:Product}] : relations = [{model:Product}];
        const user = await User.findByPk(req.params.id,{
            attributes: { exclude: ['password'] },
            include: relations
        } );
        if (!user)
            return res.status(404).json({ message: "user not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        
        const { username, email, password, dni, status } = req.body;
        const { id } = req.params;

        const currentStatus = req.user.status;
        


        if (email && !validateEmail(email))
            return res.status(400).json({ message: "invalid email" });

        if (password && !validatePassword(password))
            return res.status(400).json({ message: "invalid password" });

        if (username && !validateUsername(username))
            return res.status(400).json({ message: "invalid username" });

        if (dni && !validateDNI(dni))
            return res.status(400).json({ message: "invalid dni" });

        if(status && ![ "Buyer", "Seller", "SysAdmin"].includes(status))
            return res.status(400).json({ message: "invalid status" });
        
        if(req.user.status !== "SysAdmin" && (currentStatus !== "Buyer" && status !== "Seller"))
            return res.status(403).json({ message: "insufficient permissions" });

        if (password) {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            req.body.password = await bcrypt.hash(password, salt);
        }
        
        const toUpdate = {}
        
        Object.keys(req.body).forEach(field => {
            if (['username', 'email', 'password', 'dni', 'status'].includes(field))
                toUpdate[field] = req.body[field]
        });
        
                if(Object.keys(toUpdate).length === 0){
                    res.status(400).json({ message: "no fields to update" });
                    return
                }

        const user = await User.findByPk(id);
        if (!user)
            return res.status(404).json({ message: "user not found" });

        await user.update(toUpdate);

        res.json({ message: "user updated" });
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);


        if (!user)
            return res.status(404).json({ message: "user not found" });

        if (req.user.status !== "SysAdmin" && req.user.id.toString() !== id) {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        await user.update({ deleted: true });

        await Product.update(
            { deleted: true },
            { where: { userId: id } }
        );
        
        res.json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

