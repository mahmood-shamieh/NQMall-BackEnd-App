const { DataTypes, Model } = require('sequelize')
const {sequelize} = require('../config/sequelize.config');
const User = require('./user.model');
const Product = require('./product.model');



const AppConfig = sequelize.define("app_config", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    App_IOS_Version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Dashboard_IOS_Version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    App_Android_Version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Dashboard_Android_Version: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    AppEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    DashboardEnabled: {
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
    sequelize,
    modelName: "AppConfig",
    tableName: "app_config",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = AppConfig;