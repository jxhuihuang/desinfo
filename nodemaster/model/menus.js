
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    category:{
      type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING
    },
    description:{
        type:Sequelize.STRING
    },
    parent_id:{
        type:Sequelize.STRING
    },
    parent:{
        type:Sequelize.STRING
    },
    icon:{
        type:Sequelize.STRING
    },
    link:{
        type:Sequelize.STRING,
        primaryKey: true,
        unique: 'link',
    },
    // roles:{
    //     type:Sequelize.STRING
    // },
    seq:{
        type:Sequelize.BIGINT
    },
    nav_active:{
        type:Sequelize.BIGINT
    },
    active:{
        type:Sequelize.BIGINT
    },
    purview_menu:{
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
const Models=sqldb.define('des_menus', table, {
    timestamps:false,
    freezeTableName: true,
});
let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    MenusModel:Models,
    tableKeys:keys,
};
