import express from 'express';
import { PORT } from './config.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import { sequelize } from './db.js';

import "./models/User.js";
import "./models/Product.js";
import "./models/Purchase.js";
import "./models/ProductPurchase.js";

import './models/Relations.js';

const app = express();

try {
    
    app.use(express.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    })

    app.listen(PORT);
    app.use(userRoutes)
    app.use(productRoutes)
    
    await sequelize.sync({alter: true});

    console.log( `Server listening at port:${PORT}` );

} catch (error) {
    console.error('Unable to connect to the database:', error);   
}