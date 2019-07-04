
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
    province:{
        type:Sequelize.STRING
    },
    city:{
        type:Sequelize.STRING
    },
    upper_id:{
        type:Sequelize.STRING
    },
    // upper:{
    //     type:Sequelize.STRING
    // },
    avatar:{
        type:Sequelize.STRING,
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
const Models=sqldb.define('depts', table,{
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    deptModel:Models,
    tableKeys:keys,
};
