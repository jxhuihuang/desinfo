var Sequelize = require('sequelize');

const sequelize = new Sequelize('desinfo', 'root', 'root', {
    host: 'localhost', // 数据库地址
    dialect: 'mysql', // 指定连接的数据库类型
    operatorsAliases: false,
    // logging: true,   // 是否开始日志，默认是用console.log
    omitNull: true,  // 是否将undefined转化为NULL
    // 'port': 3306,
    pool: {
        max: 5, // 连接池中最大连接数量
        min: 0, // 连接池中最小连接数量
        idle: 20000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
        acquire: 60000,
    },
    timezone: '+08:00', //东八时区
});

module.exports = sequelize; //用module.exports暴露出这个接口，