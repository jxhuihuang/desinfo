//用户账户

var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    account_id:{
      type:Sequelize.BIGINT
    },
    name:{
        type:Sequelize.STRING
    },
    address:{
        type:Sequelize.STRING
    },
    number:{
        type:Sequelize.STRING
    },
    payee:{
        type:Sequelize.STRING
    },
    createData:{
        type: Sequelize.DATE, 
        defaultValue: new Date()
    },
    updataData:{
        type: Sequelize.DATE,
        defaultValue: new Date()
    }
}
const Models=sqldb.define('banks', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    BanksModel:Models,
    tableKeys:keys,
};
