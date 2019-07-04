
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
    description:{
        type:Sequelize.STRING
    },
    parents:{
        type:Sequelize.STRING
    },
    seq:{
        type:Sequelize.BIGINT
    },
    active:{
        type:Sequelize.BIGINT
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
const Models=sqldb.define('des_role', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    RoleModel:Models,
    tableKeys:keys,
};
