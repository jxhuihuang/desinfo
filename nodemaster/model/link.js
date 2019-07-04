
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');
let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    title:{
      type:Sequelize.STRING(30)
    },
    link:{
        type:Sequelize.STRING(30),
        validate: {
            isUrl:true
        }
    },
    type:{
        type:Sequelize.STRING(30)
    }
}
const Models=sqldb.define('des_task',table,{
    timestamps:false,
    freezeTableName: true,
});


let keys=[];
for (let key in table) {
    keys.push(key);
}
module.exports = {
    LinkModel:Models,
    tableKeys:keys,
};