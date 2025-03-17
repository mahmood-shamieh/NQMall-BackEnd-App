const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config');
const Product = require('./product.model');



const Attribute = sequelize.define('attributes',
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        Type: {
            type: DataTypes.ENUM("list", "items", "images"),
            allowNull: true,
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
    modelName: 'Attribute', // give our model a name
    timestamps: true, // enable automatic timestamp handling
    createdAt: 'CreatedAt', // customize the column name for createdAt
    updatedAt: 'UpdatedAt', // customize the column name for updatedAt
    tableName: 'attributes' // explicitly specify the table name
}
);


module.exports = Attribute;


