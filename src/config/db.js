const { Sequelize } = require('sequelize');
const path = require('path');
// Chỉ định đường dẫn đi ngược ra ngoài để tìm .env
require('dotenv').config({ path: path.join(__dirname, '../../DataBase.env') });

const dbPassword = String(process.env.DB_PASSWORD || '160203');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres', 
    process.env.DB_USER || 'postgres', 
    dbPassword, 
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

module.exports = sequelize;