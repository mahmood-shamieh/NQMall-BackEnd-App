const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/sequelize.config');



const OrderStatus = sequelize.define("orderStatus", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    NameEn: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    modelName: "orderStatus",
    tableName: "order_status",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = OrderStatus;