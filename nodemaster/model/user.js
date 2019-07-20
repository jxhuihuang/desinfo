
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    username:{
      type:Sequelize.STRING
    },
    password:{
        type:Sequelize.STRING
    },
    name:{
        type:Sequelize.STRING
    },
    phone:{
        type:Sequelize.STRING
    },
    unit_category:{
        type:Sequelize.STRING
    },
    
    career:{
        type:Sequelize.STRING
    },
    
    timezone:{
        type:Sequelize.STRING
    },
    // account_balance:{
    //     type:Sequelize.STRING,
    //     defaultValue: "0.00"
    // },
    // account_password:{
    //     type:Sequelize.STRING
    // },
    avatar:{
        type:Sequelize.STRING,
        // defaultValue: 'default.png'
    },
    identity_card:{
        type:Sequelize.TEXT
    },
    work_permit:{
        type:Sequelize.STRING
    },
    business_license:{
        type:Sequelize.STRING
    },
    production_license:{
        type:Sequelize.STRING
    },
    dept_id:{
        type:Sequelize.STRING
    },
    dept:{
        type:Sequelize.STRING
    },
    invitation_dept_id:{
        type:Sequelize.STRING
    },
    roles:{
        type:Sequelize.STRING
    },
    roles_name:{
        type:Sequelize.STRING
    },
    seq:{
        type:Sequelize.BIGINT
    },
    active:{
        type:Sequelize.BIGINT
    },
    email:{
        type:Sequelize.STRING
    },
    invitation_dept_id:{
        type:Sequelize.STRING
    },
    invitation_dept:{
        type:Sequelize.STRING
    },
    wechat_open_id:{
        type:Sequelize.STRING
    },
    wechat_union_id:{
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
const Models=sqldb.define('des_user', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    UserModel:Models,
    tableKeys:keys,
};
