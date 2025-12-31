const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatHistory = sequelize.define('ChatHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    role: {
        type: DataTypes.ENUM('user', 'model'),
        allowNull: false
    },
    message: { type: DataTypes.TEXT, allowNull: false }
});

module.exports = ChatHistory;
