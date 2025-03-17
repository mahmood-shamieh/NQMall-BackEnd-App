const DataTypes = require('sequelize');
const {sequelize} = require('../config/sequelize.config')


const Media = sequelize.define('media', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URL: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Type: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
    },
    Size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},
    {
        sequelize,
        timestamps: true,
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        tableName: 'media'
    });
module.exports = Media;