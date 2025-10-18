import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Purchase = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
},)