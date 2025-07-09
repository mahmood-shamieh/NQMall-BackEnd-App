const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/sequelize.config');



const OrderItem = sequelize.define("orderItems", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    SalePrice: {
        type: DataTypes.DECIMAL(10, 2)
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
    modelName: "orderItems",
    tableName: "order_items",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = OrderItem;