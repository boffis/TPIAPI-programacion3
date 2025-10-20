import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Product = sequelize.define("product", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        //Top, Bottom, Footwear, Accessory
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"Accessory",
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{ timestamps: false })