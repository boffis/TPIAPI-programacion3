import express from 'express';
import { PORT } from './config.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import purchaseRoutes from './routes/purchase.routes.js'
import { sequelize } from './db.js';
import { initialData } from './utils/initialData.js';
import "./models/Product.js";
import "./models/Purchase.js";
import "./models/ProductPurchase.js";
import "./models/User.js";

import './models/Relations.js';

const app = express();
import cors from 'cors';

try {
    
    
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    })

    app.use(userRoutes)
    app.use(productRoutes)
    app.use(purchaseRoutes)
    console.log("Created Models:", sequelize.models);

    await sequelize.sync({force: true});

    await initialData()
    
    app.listen(PORT);

    console.log( `Server listening at port:${PORT}` );

} catch (error) {
    console.error('Unable to connect to the database:', error);   
}