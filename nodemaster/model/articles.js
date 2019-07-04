
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    title:{
      type:Sequelize.STRING
    },
    author_id:{
        type:Sequelize.BIGINT
    },
    category_id:{
        type:Sequelize.STRING
    },
    content:{
        type:Sequelize.TEXT
    },
    active:{
        type:Sequelize.BIGINT
    },
    hits:{
        type:Sequelize.BIGINT
    },
    created_at:{
        type: Sequelize.DATE, 
        defaultValue: new Date()
    },
    modified_at:{
        type: Sequelize.DATE,
        defaultValue: new Date()
    }
}
const Models=sqldb.define('articles', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    ArticlesModel:Models,
    tableKeys:keys,
};
