
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    menus_id:{
        type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING
    },
    link:{
      type:Sequelize.STRING
    },
    role:{
        type:Sequelize.STRING
    },
    category:{
        type:Sequelize.STRING
    },
    permission_list:{
        type:Sequelize.TEXT
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
const Models=sqldb.define('des_permission', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    PermissionModel:Models,
    tableKeys:keys,
};
