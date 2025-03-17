const { Model, DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config');
const Cart = require('./cart.model');
const User = require('./user.model');
const attribute = require('./attribute.model');
const Attribute = require('./attribute.model');
const Brand = require('./brand.model');
const Category = require('./category.model');
const Rating = require('./rating.model');



const Product = sequelize.define('products', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: false,

    },
    NameEn: {
        type: DataTypes.STRING(255),
        allowNull: false,

    },
    DescriptionAr: {
        type: DataTypes.TEXT,
        allowNull: false,

    },
    DescriptionEn: {
        type: DataTypes.TEXT,
        allowNull: false,

    },
    Price: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    SalePrice: {
        type: DataTypes.INTEGER,
        allowNull: true,

    },

    DetailsAr: {
        type: DataTypes.JSON,
    },
    DetailsEn: {
        type: DataTypes.JSON,
    },

    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    modelName: 'Products',
    timestamps: true, // Enable Sequelize to automatically manage createdAt and updatedAt
    createdAt: 'CreatedAt', // Customize the column name for createdAt
    updatedAt: 'UpdatedAt', // Customize the column name for updatedAt
    tableName: 'products' // Explicitly specify the table name
});



module.exports = Product;