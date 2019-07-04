
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
    report_category:{
      type:Sequelize.STRING
    },
    report_type:{
        type:Sequelize.STRING
    },
    adr_type:{
        type:Sequelize.STRING
    },
    adr_type_serious:{
        type:Sequelize.STRING
    },
    reporting_unit_category:{
        type:Sequelize.STRING
    },
    patient_name:{
        type:Sequelize.STRING
    },
    patient_sex:{
        type:Sequelize.STRING
    },
    country:{
        type:Sequelize.STRING
    },
    race:{
        type:Sequelize.STRING
    },
    patient_birth_date:{
        type: Sequelize.DATE,
    },
    patient_age:{
        type:Sequelize.STRING,
    },
    
    patient_nation:{
        type:Sequelize.STRING
    },
    patient_weight:{
        type:Sequelize.STRING
    },
    stature:{
        type:Sequelize.STRING
    },
    patient_phone:{
        type:Sequelize.STRING
    },
    patient_original_disease:{
        type:Sequelize.STRING
    },
    hospital_name:{
        type:Sequelize.STRING
    },
    medical_record_number:{
        type:Sequelize.STRING
    },
    has_past_adr:{
        type:Sequelize.STRING
    },
    has_past_adr_detail:{
        type:Sequelize.STRING
    },
    has_family_adr:{
        type:Sequelize.STRING
    },
    has_family_adr_detail:{
        type:Sequelize.STRING
    },
    relevant_info:{
        type:Sequelize.STRING
    },
    relevant_info_allergy_history:{
        type:Sequelize.STRING
    },
    relevant_info_other:{
        type:Sequelize.STRING
    },
    disease_record:{
        type:Sequelize.TEXT
    },
    medication_record:{
        type:Sequelize.TEXT
    },
    adr_name:{
        type:Sequelize.STRING
    },
    adr_time:{
        type: Sequelize.DATE, 
    },
    adr_end_time:{
        type: Sequelize.DATE, 
    },
    adr_continued_time:{
        type:Sequelize.STRING
    },
    adr_description:{
        type:Sequelize.STRING
    },
    adr_result:{
        type:Sequelize.STRING
    },
    adr_result_sequela_manifestation:{
        type:Sequelize.STRING
    },
    adr_result_death_reason:{
        type:Sequelize.STRING
    },
    adr_result_death_time:{
        type: Sequelize.DATE, 
    },
    adr_result_isautopsy:{
        type:Sequelize.STRING
    },
    adr_result_autopsy_results:{
        type:Sequelize.STRING
    },
    adr_isexpect:{
        type:Sequelize.STRING
    },
    reduce_after_reduction:{
        type:Sequelize.STRING
    },
    repeat_after_using_again:{
        type:Sequelize.STRING
    },
    impact_on_original_disease:{
        type:Sequelize.STRING
    },
    reporter_evaluation:{
        type:Sequelize.STRING
    },
    report_unit_evaluation:{
        type:Sequelize.STRING
    },
    
    reporter_phone:{
        type:Sequelize.STRING
    },
    reporter_career:{
        type:Sequelize.STRING
    },
    reporter_email:{
        type:Sequelize.STRING
    },
    reporter_signature:{
        type:Sequelize.STRING
    },
    report_unit_name:{
        type:Sequelize.STRING
    },
    report_unit_contact:{
        type:Sequelize.STRING
    },
    report_unit_phone:{
        type:Sequelize.STRING
    },
    report_date:{
        type: Sequelize.DATE,
    },
    report_from:{
        type:Sequelize.STRING
    },
    report_from_other:{
        type:Sequelize.STRING
    },
    state:{
        type:Sequelize.BIGINT
    },
    laboratory_record:{
        type:Sequelize.TEXT
    },
    gestation_record:{
        type:Sequelize.TEXT
    },
    historyMedication_record:{
        type:Sequelize.TEXT
    },
    attachment:{
        type:Sequelize.TEXT
    },
    remark:{
        type:Sequelize.STRING
    },
    reward:{
        type:Sequelize.STRING
    },
    opinion:{
        type:Sequelize.STRING
    },
    published:{
        type:Sequelize.STRING
    },
    reporter_id:{
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
const Models=sqldb.define('des_report', table, {
    timestamps:false,
    freezeTableName: true,
});

let keys=[];
for (let key in table) {
    keys.push(key);
}

module.exports = {
    ReportModel:Models,
    tableKeys:keys,
};
