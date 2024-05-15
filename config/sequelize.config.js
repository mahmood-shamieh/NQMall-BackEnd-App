const Sequelize = require("sequelize");
const sequelize =
    new Sequelize
        ('nq_mall', 'root', 'root', {
            host: '127.0.0.1',
            dialect: 'mysql',
            pool: {
                max: 30,
                min: 10,
                acquire: 30000,
                idle: 10000
            }
        });
// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.sequelize.sync();
module.exports = sequelize, Sequelize;