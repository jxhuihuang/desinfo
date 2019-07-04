/**数字字典(查询数字字典内容)*/
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var URL = require('url');
var qs = require('qs')
var router = express.Router();
var Sequelize = require('sequelize');
let {DicValueModel, tableKeys}=require('../../model/dictionaryData')
let {filter, indexof, stringToArry}=require('../../common/untils');
var mysql = new DBSQLS(DicValueModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    var params =qs.parse(req.body)
    const _methods=params._methods?params._methods:"query";
    params=filter(tableKeys, params); //过滤
    if(params.prentCode && indexof(params.prentCode, ",")){
        let prentCode=params.prentCode
        params.prentCode={[Op.or]:stringToArry(prentCode)}
    }
    switch (_methods){
        case "query":
            mysql.findAll({
                order:[['seq', 'ASC']],
                where:params
            },(result)=>{
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                    data: result,
                })
            },{res})
        break;
        case "search":
            mysql.findAll({
                order:[['seq', 'ASC']],
                where:{
                    name:{[Op.like]:'%ye%'},
                    prentCode:"unit_category"
                }
            },(result)=>{
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                    data: result,
                })
            },{res})
        break;
    }
})
module.exports = router;