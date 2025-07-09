const { DataTypes, Model } = require('sequelize')
const {sequelize} = require('../config/sequelize.config');

const Category = sequelize.define('categories', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Parent: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: 'categories', // refers to table name
    //         key: 'ID', // 'UserID' is the column name in the 'Users' table
    //     }
    // },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    NameEn: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    DescriptionAr: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    DescriptionEn: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ImageURL: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    ImageSize: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    sequelize,
    modelName: 'Categories',
    timestamps: true, // Enable Sequelize to automatically manage createdAt and updatedAt
    createdAt: 'CreatedAt', // Customize the column name for createdAt
    updatedAt: 'UpdatedAt', // Customize the column name for updatedAt
    tableName: 'categories'
});

module.exports = Category;