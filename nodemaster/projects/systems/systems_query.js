var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {SystemsModel, tableKeys}=require('../../model/systems')
let {filter}=require('../../common/untils');
var mysql = new DBSQLS(SystemsModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    switch (_methods){
        //查询方法 
        case "query":
            params=filter(tableKeys, params); //过滤
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
        break;
        case "updata":
            params=filter(tableKeys, params); //过滤
            if(params.id){
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
            }else{
                mysql.create(params,result=>{
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"修改成功"
                    })
                },{res})
            }
        break;  
    }
})

module.exports = router;