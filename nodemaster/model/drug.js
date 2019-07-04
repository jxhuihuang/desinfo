
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    product_name:{
      type:Sequelize.STRING,
    },
    english_name:{
        type:Sequelize.STRING
    },
    trade_name:{
        type:Sequelize.STRING
    },
    approval_number:{
        type:Sequelize.STRING
    },
    dosage_form:{
        type:Sequelize.STRING
    },
    specification:{
        type:Sequelize.STRING
    },
    original_approval_number:{
        type:Sequelize.STRING,
    },
    product_category:{
        type:Sequelize.STRING
    },
    approval_date:{
        type: Sequelize.DATE, 
    },
    production_unit:{
        type:Sequelize.STRING
    },
    manufacturer_id:{
        type:Sequelize.STRING
    },
    // manufacturer:{
    //     type:Sequelize.STRING
    // },
    production_address:{
        type:Sequelize.STRING
    },
    drug_standard_code:{
        type:Sequelize.STRING
    },
    drug_standard_code_remark:{
        type:Sequelize.STRING
    },
    instruction_manual:{
        type:Sequelize.STRING
    },
    reward:{
        type:Sequelize.BIGINT
    },
    quantity:{
        type:Sequelize.BIGINT
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
const Models=sqldb.define('des_drug', table,{
    timestamps:false,
    freezeTableName: true,
    indexes: [
        {
            unique: true,
            fields: ['product_name']
        }
    ]
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    DrugModel:Models,
    tableKeys:keys,
};
