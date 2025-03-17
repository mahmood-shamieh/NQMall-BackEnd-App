const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config');



const Values = sequelize.define('values',
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

       
        ValueAr: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ValueEn: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        HoverImageAr: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        HoverImageEn: {
            type: DataTypes.STRING(255),
            allowNull: true,
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
    modelName: 'values', // give our model a name
    timestamps: true, // enable automatic timestamp handling
    createdAt: 'CreatedAt', // customize the column name for createdAt
    updatedAt: 'UpdatedAt', // customize the column name for updatedAt
    tableName: 'values' // explicitly specify the table name
}
);


module.exports = Values;


