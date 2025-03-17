const Sequelize = require("sequelize");
const dbName = "nq_mall";
// const dbName = "daysmart_nqmall";
const dbUser = "root";
// const dbUser = "daysmart_nqmall";
const dbPassword = "root";
// const dbPassword = "n-tC5Zc^i0yc";
const sequelize =
    new Sequelize
        (dbName, dbUser, dbPassword, {
            host: '127.0.0.1',
            dialect: 'mysql',
            logging: false,
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
module.exports = { sequelize, Sequelize };