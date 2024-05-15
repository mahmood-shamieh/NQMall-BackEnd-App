const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/sequelize.config');
const User = require('./user.model');
const Product = require('./product.model');



const Cart = sequelize.define("cart", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    sequelize,
    modelName: "Cart",
    tableName: "cart",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = Cart;