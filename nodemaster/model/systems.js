
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    name:{
      type:Sequelize.STRING
    },
    logo:{
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
const Models=sqldb.define('systems', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    SystemsModel:Models,
    tableKeys:keys,
};
