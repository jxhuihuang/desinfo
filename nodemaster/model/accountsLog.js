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
    
    mode:{
        type:Sequelize.STRING
    },
    report_id:{
        type:Sequelize.BIGINT,
    },
    balance_before:{
        type:Sequelize.DECIMAL
    },
    balance_after:{
        type:Sequelize.DECIMAL
    },
    amount:{
        type:Sequelize.DECIMAL
    },
    remark:{
        type:Sequelize.STRING
    },
    state:{
        type:Sequelize.BIGINT
    },
    created_at:{
        type: Sequelize.DATE, 
        defaultValue: new Date()
    },
    
    updataData:{
        type: Sequelize.DATE,
        defaultValue: new Date()
    }
}
const Models=sqldb.define('account_logs', table, {
    timestamps:false,
    freezeTableName: true,
});


let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    AccountsLogModel:Models,
    tableKeys:keys,
};
