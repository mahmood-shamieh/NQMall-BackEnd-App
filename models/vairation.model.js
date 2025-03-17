const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config');



const Variations = sequelize.define('variations',
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        Price: {
            type: DataTypes.DECIMAL,
            defaultValue: 0,
        },
        Stock: {
            type: DataTypes.DECIMAL,
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
    modelName: 'variations', // give our model a name
    timestamps: true, // enable automatic timestamp handling
    createdAt: 'CreatedAt', // customize the column name for createdAt
    updatedAt: 'UpdatedAt', // customize the column name for updatedAt
    tableName: 'variations' // explicitly specify the table name
}
);


module.exports = Variations;


