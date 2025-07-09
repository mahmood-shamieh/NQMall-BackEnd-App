const { DataTypes, Model } = require('sequelize')
const {sequelize} = require('../config/sequelize.config');
const User = require('./user.model');
const Product = require('./product.model');



const Section = sequelize.define("sections", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    NameAr: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    NameEn: {
        type: DataTypes.STRING,
        allowNull:false,
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
    modelName: "Section",
    tableName: "sections",
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    timestamps: true,
});




module.exports = Section;