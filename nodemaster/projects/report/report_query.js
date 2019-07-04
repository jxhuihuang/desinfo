var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
var jwt=require("jsonwebtoken")
// var URL = require('url');
let {ReportModel, tableKeys}=require('../../model/report')
let {UserModel, tableKeys:userKey}=require('../../model/user')
let {filter, jwtVerify}=require('../../common/untils');
var mysql = new DBSQLS(ReportModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    jwtVerify(req, jwt,function(decode){
        switch (_methods){
            //查询方法 
            case "query":
                let {page=0, size=0}=params;
                params=filter(tableKeys, params); //过滤
                let prmissions=req.session.permission;
                if(page!=0 && size!=0){
                    let limit=parseInt(size);
                    let offset=(page-1)*limit;
                    ReportModel.belongsTo(UserModel, {foreignKey: 'reporter_id', targetKey:'id'});
                    mysql.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        include: [{
                            model: UserModel,
                            attributes: ['username', 'name', 'phone', 'email', 'career', 'avatar'],
                        }],
                        order:[['createData', 'ASC']],
                        where:params
                    },(result,count)=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            data: result,
                            draw: page,
                            recordsFiltered: count,
                            recordsTotal: count,
                            prmissions:prmissions,
                        })
                    },{res})
                }else{
                    mysql.findAll({
                        order:[['createData', 'ASC']],
                        where:params
                    },(result)=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            data: result,
                        })
                    },{res})
                }
                
            break;
            case "insert":
                let decodes=decode;
                params=filter(tableKeys, params); //过滤
                params.disease_record=params.disease_record?JSON.stringify(params.disease_record):""
                params.medication_record=params.medication_record?JSON.stringify(params.medication_record):"";
                params.laboratory_record=params.laboratory_record?JSON.stringify(params.laboratory_record):"";
                params.gestation_record=params.gestation_record?JSON.stringify(params.gestation_record):"";
                params.historyMedication_record=params.historyMedication_record?JSON.stringify(params.historyMedication_record):"";
                params.attachment=params.attachment?JSON.stringify(params.attachment):"";
                params.reporter_id=decodes.id;
                mysql.findAndCountAll({
                    where:{number:params.number}
                },(result,count)=>{
                    if(count>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"报告已存在"
                        })
                    }else{
                        mysql.create(params,result=>{
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                resultMsg:"新增成功"
                            })
                        },{res})
                    }
                },{res})
            break;

            case "updata":
                params=filter(tableKeys, params); //过滤
                params.disease_record=params.disease_record?JSON.stringify(params.disease_record):"";
                params.medication_record=params.medication_record?JSON.stringify(params.medication_record):"";
                params.laboratory_record=params.laboratory_record?JSON.stringify(params.laboratory_record):"";
                params.gestation_record=params.gestation_record?JSON.stringify(params.gestation_record):"";
                params.historyMedication_record=params.historyMedication_record?JSON.stringify(params.historyMedication_record):"";
                params.attachment=params.attachment?JSON.stringify(params.attachment):"";
                
                mysql.findAndCountAll({
                    where:{
                        number:params.number,
                        id:{[Op.ne]:params.id}
                    }
                },(result,count)=>{
                    if(count>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"报告已存在"
                        })
                    }else{
                        mysql.update(params,{
                            where :{id:params.id}
                        },result=>{
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                resultMsg:"修改成功"
                            })
                        },{res})
                    }
                },{res})
            break;
            case "delete":
                params=filter(tableKeys, params); //过滤
                mysql.delete({
                    where:params,
                },function(result){
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                    })
                },{res:res})
            break
        }
    })
})

module.exports = router;