const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize.config');
const Cart = require('./cart.model');
const Product = require('./product.model');
const Rating = require('./rating.model');

const User = sequelize.define('users', {

    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        // unique: true,
    }, FcmToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        // unique: true,
    }, Lang: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "ar"  
        // unique: true,
    },
    PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    FullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // Address: {
    //     type: DataTypes.JSON,

    //     // No allowNull since JSON can be empty indicating no address
    // },
    Address: {
        type: DataTypes.STRING,

        // No allowNull since JSON can be empty indicating no address
    },
    PhoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        // No allowNull assuming phone number can be optional
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    Role: {
        type: DataTypes.ENUM('customer', 'admin', 'vendor'),
        defaultValue: 'customer',
    },
}, {
    sequelize, // This is your Sequelize instance
    modelName: 'users',
    timestamps: true, // Enable Sequelize to automatically manage createdAt and updatedAt
    createdAt: 'CreatedAt', // Customize the column name for createdAt
    updatedAt: 'UpdatedAt', // Customize the column name for updatedAt
    tableName: 'users' // Explicitly specify the table name
});




module.exports = User;