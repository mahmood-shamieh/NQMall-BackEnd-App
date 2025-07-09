const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/sequelize.config');



const Order = sequelize.define("orders", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    OrderNumber: {
        type: DataTypes.STRING,
        // unique: true,
        // allowNull: false
    },
    PaymentMethod: {
        type: DataTypes.ENUM('credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'),
        allowNull: false
    },
    PaymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    mobile: {
        type: DataTypes.STRING
    },
    Notes: {
        type: DataTypes.TEXT
    },
    ResponseNote: {
        type: DataTypes.TEXT
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    modelName: "orders",
    tableName: "orders",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = Order;