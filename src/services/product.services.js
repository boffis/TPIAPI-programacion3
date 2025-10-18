
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import {Purchase} from "../models/Purchase.js";

export const createProduct = async (req, res) => {
    try {
        const { name, desc, price, stock, type, tags } = req.body;
        const { status, id: userId } = req.user;
        
        if (!name || !price || !stock || !userId || !status || !type) {
            return res.status(400).json({ message: "missing required fields" });
        }

        if (status !== "SysAdmin" || status !== "Seller") {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        //!faltarian validaciones de los campos pe

        const newProduct = await Product.create({
            name,
            desc,
            price,
            stock,
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

        if (status !== "SysAdmin" || status !== "Seller") {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        const product = await Product.findByPk(id,{include: [{model:User}]});

        if (status === "Seller" && product.User.id != userId) {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        await product.update({ deleted: true });

        res.json({ message: "product deleted" });

        if (!product)
            return res.status(404).json({ message: "product not found" });



    } catch (error) {
        
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ where: { deleted: false }});

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

        let relations
        if (status === "SysAdmin" || (status === "Seller" && product.User.id == userId)) {
            relations = [{model:User}, {model:Purchase}];
        }   else {
            relations = [{model:User}];
        }


        const product = await Product.findByPk(id, {include: relations });

        if (!product || product.deleted)
            return res.status(404).json({ message: "product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {name, desc, price, stock, type, tags } = req.body;
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

        
        const toUpdate = {}
        
        Object.keys(req.body).forEach(field => {
            if (['name', 'desc', 'price', 'stock', 'type', 'tags'].includes(field))
                toUpdate[field] = req.body[field]
        });

        if(Object.keys(toUpdate).length === 0){
            res.status(400).json({ message: "no fields to update" });
            return
        }

        await product.update(toUpdate);

        res.json({ message: "product updated" });

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}