import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const ProductPurchase = sequelize.define("ProductPurchase", {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    } 
});
