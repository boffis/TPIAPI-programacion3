import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const ProductPurchase = sequelize.define("productPurchase", {
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    subtotal: {
        type: DataTypes.FLOAT,
    } 
});
