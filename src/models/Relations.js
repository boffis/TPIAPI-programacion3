import {User} from './User.js';
import {Product} from './Product.js';
import {Purchase} from './Purchase.js';
import {ProductPurchase} from './ProductPurchase.js';

User.hasMany(Purchase);
Purchase.belongsTo(User);

Purchase.belongsToMany(Product, { through: ProductPurchase });
Product.belongsToMany(Purchase, { through: ProductPurchase });

User.hasMany(Product);
Product.belongsTo(User);
