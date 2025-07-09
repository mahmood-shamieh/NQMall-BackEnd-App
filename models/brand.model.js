const DataTypes = require('sequelize');
const {sequelize} = require('../config/sequelize.config');
const Product = require('./product.model');



const Brand = sequelize.define('brands', {
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
    LogoUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,

    },
    LogoSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0

    },
    WebSiteUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,

    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    DescriptionAr: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    DescriptionEn: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},
    {
        sequelize,
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt',
        tableName: "brands",
        modelName: "brands"
    }
);

module.exports = Brand;