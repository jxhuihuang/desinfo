
var Sequelize = require('sequelize');
var sqldb = require('../config/mysql');

let table={
    id:{
        type:Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    number:{
        type:Sequelize.STRING
    },
    production_address:{
        type:Sequelize.TEXT
    },
    production_scope:{
        type:Sequelize.TEXT
    },
    issued_date:{
        type: Sequelize.DATE, 
    },
    valid_until:{
        type: Sequelize.DATE, 
    },
    issuing_organ:{
        type:Sequelize.STRING
    },
    issuer:{
        type:Sequelize.STRING
    },
    daily_regulatory_agency:{
        type:Sequelize.STRING
    },
    daily_supervisor:{
        type:Sequelize.STRING
    },
    organization_code:{
        type:Sequelize.STRING
    },
    report_phone:{
        type:Sequelize.STRING
    },
    remark:{
        type:Sequelize.TEXT
    },
    category_code:{
        type:Sequelize.STRING
    },
    province:{
        type:Sequelize.STRING
    },
    company_name:{
      type:Sequelize.STRING
    },
    legal_representative:{
        type:Sequelize.STRING
    },
    company_manager:{
        type:Sequelize.STRING,
    },
    quality_manager:{
        type:Sequelize.STRING
    },
    registered_address:{
        type:Sequelize.TEXT
    },
    city:{
        type:Sequelize.STRING,
    },
    
    dept_id:{
        type:Sequelize.BIGINT,
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
const Models=sqldb.define('des_manufacturer', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    ManufacturerModel:Models,
    tableKeys:keys,
};