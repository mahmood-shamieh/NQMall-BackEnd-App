const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config');



const ProductVariationValues = sequelize.define('product_variation_values',
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
    modelName: 'product_variation_values', // give our model a name
    timestamps: true, // enable automatic timestamp handling
    createdAt: 'CreatedAt', // customize the column name for createdAt
    updatedAt: 'UpdatedAt', // customize the column name for updatedAt
    tableName: 'product_variation_values' // explicitly specify the table name
}
);


module.exports = ProductVariationValues;


