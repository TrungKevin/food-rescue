const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }, // Tên món cụ thể
    description: { type: DataTypes.TEXT }, // Mô tả món ăn
    category: { type: DataTypes.STRING }, // Ví dụ: Cơm, Phở, Bánh mì
    originalPrice: { type: DataTypes.INTEGER, allowNull: false },
    salePrice: { type: DataTypes.INTEGER, allowNull: false },
    stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: { type: DataTypes.STRING }, // Link ảnh món ăn
    location: {
        type: DataTypes.GEOMETRY('POINT', 4326),
        allowNull: true // Cho phép null tạm thời để sync
    },
    status: {
        type: DataTypes.ENUM('active', 'out_of_stock', 'closed'),
        defaultValue: 'active'
    },
    expiryTime: {
        type: DataTypes.TIME,
        allowNull: true
    }
});

module.exports = Product;