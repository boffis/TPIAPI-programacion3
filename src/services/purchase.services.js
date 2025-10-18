
import { Purchase } from "../models/Purchase"
import { Product } from "../models/Product"
import { User } from "../models/User"

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
        const { products } = req.body;
        const { id: buyerId } = req.user;
        
        if (!buyerId || !products || products.length === 0) {
            return res.status(400).json({ message: "missing buyerId or products" });
        }

        const user = await User.findByPk(buyerId);
        if (!user)
            return res.status(404).json({ message: "buyer not found" });

        
        const purchase = Purchase.create({
            userId: buyerId
        })

        let total = 0;
        for (const element of products ) {
            const product = await Product.findByPk(element.id)
            if (!product || product.stock <= element.quantity || product.deleted)
                return res.status(404).json({ message: `product with id ${element.id} not found`
                });

            await product.update({ stock: product.stock - element.quantity });

            product.subTotal = product.price * element.quantity;
            total += product.subTotal;
            await purchase.addProduct(product, { through: { quantity: element.quantity }})
        };

        await purchase.update({ total });

        res.status(201).json({ message: "purchase created", purchaseId: purchase.id });

    } catch (error) {
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

