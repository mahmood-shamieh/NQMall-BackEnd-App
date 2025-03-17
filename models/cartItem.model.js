const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config');
const Cart = require('./cart.model');
const Product = require('./product.model');
const Rating = require('./rating.model');

const CartItem = sequelize.define('CartItems', {

    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Quantity: {
        type: DataTypes.INTEGER,
        default: 1
    },
    PriceAtAddition: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },

    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize, // This is your Sequelize instance
    modelName: 'CartItem',
    timestamps: true, // Enable Sequelize to automatically manage createdAt and updatedAt
    createdAt: 'CreatedAt', // Customize the column name for createdAt
    updatedAt: 'UpdatedAt', // Customize the column name for updatedAt
    tableName: 'Cart_items' // Explicitly specify the table name
});




module.exports = CartItem;