const DataTypes = require('sequelize')
const {sequelize} = require('../config/sequelize.config')

const Rating = sequelize.define('ratings',
    {
        Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        CreatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        sequelize, // This is your Sequelize instance
        modelName: 'ratings',
        timestamps: true, // Enable Sequelize to automatically manage createdAt and updatedAt
        createdAt: 'CreatedAt', // Customize the column name for createdAt
        updatedAt: 'UpdatedAt', // Customize the column name for updatedAt
        tableName: 'ratings' // Explicitly specify the table name
    });

    

module.exports = Rating