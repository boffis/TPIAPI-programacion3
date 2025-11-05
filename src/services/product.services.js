
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import {Purchase} from "../models/Purchase.js";
import { Op } from "sequelize";

export const createProduct = async (req, res) => {
    try {
        const { name, desc, price, stock, type, imageURL, tags } = req.body;
        const { status, id: userId } = req.user;
        
        if (!name || !price || !stock || !userId ||!imageURL || !status || !type) {
            return res.status(400).json({ message: "missing required fields" });
        }

        if (status !== "SysAdmin" && status !== "Seller") {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        //!faltarian validaciones de los campos pe

        const newProduct = await Product.create({
            name,
            desc,
            price,
            stock,
            imageURL,
            userId
        });

        res.status(201).json({ message: "product created", productId: newProduct.id });

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, id: userId } = req.user;

        if (!id)
            return res.status(400).json({ message: "missing product id" });

        if (status !== "SysAdmin" && status !== "Seller") {
            return res.status(403).json({ message: "insufficient permissions" });
        }
        console.log("finding")

        const product = await Product.findByPk(id,{include: [{model:User}]});
        console.log("found")

        if (status === "Seller" && product.userId != userId) {
            return res.status(403).json({ message: "insufficient permissions" });
        }
        console.log("permissions")

        await product.update({ deleted: true });

        console.log("done")
        res.json({ message: "product deleted" });

        if (!product)
            return res.status(404).json({ message: "product not found" });



    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error });
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ where: { deleted: false, stock:{[Op.gt]:0} }});

        res.json(products);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}


export const getProductsAdmin = async (req, res) => {
    try { 
        const {status} = req.user
            
        if (status!=="SysAdmin" ) return res.status(403).json({ message: "insufficient permissions" });
        
        const products = await Product.findAll({include:[{ model: User }]});

        res.json(products);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const getProductById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const { status, id: userId } = req.user;

        if (!id)
            return res.status(400).json({ message: "missing product id" });

        const product = await Product.findByPk(id, { include: [{ model: User }] });

        let relations = [{ model: User }];
        
        
        
        if (status === "SysAdmin" || (status === "Seller" && product.user.id == userId)) {
            relations.push( {model:Purchase});
        } 
        
        const productWithRelations = await Product.findByPk(id, {include: relations });


        if (!product || product.deleted)
            return res.status(404).json({ message: "product not found" });

        res.json(productWithRelations);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {name, desc, price, stock, type} = req.body;
        const { status } = req.user;
        const userId = req.user.id;
        if (!id)
            return res.status(400).json({ message: "missing product id" });

        const product = await Product.findByPk(id);

        if (!product || product.deleted)
            return res.status(404).json({ message: "product not found" });

        if (status !== "SysAdmin" && product.userId !== userId) {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        
        if (product.name === name && product.desc === desc && product.price === price && product.stock === stock && product.type === type) {
            return res.status(400).json({message:"no fields to update"})
        }

        await product.update({name, desc, price, stock, type});

        res.json({ message: "product updated" });

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}