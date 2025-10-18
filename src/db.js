import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tpi.db',
    logging: false,
}); 