
import { Purchase } from "../models/Purchase.js"
import { Product } from "../models/Product.js"
import { User } from "../models/User.js"

export const getPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, id: userId } = req.user;
        if (!id)
            return res.status(400).json({ message: "missing purchase id" });

        
        const purchase = await Purchase.findByPk(id, {
            include: [{ model: Product }, { model: User, attributes: { exclude: ['password'] } }]
        });

        if (!purchase || purchase.deleted)
            return res.status(404).json({ message: "purchase not found" });

        if (status !== "SysAdmin" && purchase.User.id != userId) {
            return res.status(403).json({ message: "insufficient permissions" });
        }

        res.json(purchase);
        
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

export const makePurchase = async (req, res) => {
    try {
        console.log("reached post purchase")
        const { products } = req.body;
        const { id: buyerId } = req.user;
        
        if (!buyerId || !products || products.length === 0) {
            return res.status(400).json({ message: "missing buyerId or products" });
        }

        const user = await User.findByPk(buyerId);
        if (!user)
            return res.status(404).json({ message: "buyer not found" });

        
        const purchase = await Purchase.create({
            userId: buyerId
        })

        let total = 0;
        
        for (const element of products ) {
            const product = await Product.findByPk(element.id)
            if (!product  || product.deleted)
                return res.status(404).json({ message: `product with id ${element.id} not found`
                });
                console.log(product.stock)
                console.log(element)
            if ( product.stock >=element.quantity) {
                await product.update({ stock: product.stock - element.quantity });
            } else {
                res.status(400).json({message:`${element.name} doesnt have enough stock`})
            }

            element.subtotal = product.price * element.quantity;
            total += element.subtotal;
            await purchase.addProduct(product, { through: { quantity: element.quantity, subtotal:element.subtotal}})
        };

        await purchase.update({ total });
        const toSendPurchase = await Purchase.findByPk(purchase.id, {
                    include: [{ model: Product }, { model: User, attributes: { exclude: ['password'] } }]
                });
        res.status(201).json({ message: "purchase created", purchase:toSendPurchase });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error" });
    }

}

export const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, id:userId } = req.user;

        if (!id)
            return res.status(400).json({ message: "missing purchase id" });
        const purchase = await Purchase.findByPk(id, { include: [{ model: User }] });
        
        if (!purchase)
            return res.status(404).json({ message: "purchase not found" });
        
        if (status !== "SysAdmin"&& purchase.User.id != userId) {
            return res.status(403).json({ message: "insufficient permissions" });
        }


        purchase.update({ deleted: true });

        res.json({ message: "purchase deleted" });

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

