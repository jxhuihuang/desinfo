
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true,
        unique: true
    },
    parentId:{
        type:Sequelize.STRING,
    },
    prentCode:{
      type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING
    },
    value:{
        type:Sequelize.STRING
    },
    active:{
        type:Sequelize.BIGINT
    },
    seq:{
        type:Sequelize.BIGINT
    },
    category:{
        type:Sequelize.STRING
    },
    createData:{
        type: Sequelize.DATE,
        defaultValue: new Date()
    },
    updataData:{
        type: Sequelize.DATE,
        defaultValue: new Date()
    },
}
const Models=sqldb.define('diclist', table, {
    timestamps:false,
    freezeTableName: true,
    tableName: 'des_dictionary_value'
    // underscored: true
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    DicValueModel:Models,
    tableKeys:keys,
};
