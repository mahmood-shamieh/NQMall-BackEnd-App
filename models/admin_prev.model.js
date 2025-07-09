const { DataTypes, Model } = require('sequelize')
const {sequelize} = require('../config/sequelize.config');
const User = require('./user.model');
const Product = require('./product.model');



const AdminPrev = sequelize.define("admin_prev", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    Edit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    Delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    Add: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    modelName: "AdminPrev",
    tableName: "admin_prev",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = AdminPrev;