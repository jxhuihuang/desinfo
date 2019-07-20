//角色权限
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
var jwt=require("jsonwebtoken")
// var URL = require('url');
let {PermissionModel, tableKeys}=require('../../model/permission')
let {filter, dealparams, jwtVerify}=require('../../common/untils');
var mysql = new DBSQLS(PermissionModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    jwtVerify(req, jwt,function(decode){
        const {roles_name=""}=decode
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
                        roles_name:roles_name,
                    })
                },{res})
            break;
            case "updata":
                var perData=params.perData;
                // perData=filter(tableKeys, perData); //过滤
                perData=dealparams(perData)
                let updateOnDuplicateKey=[];
                tableKeys.map(function(obj){
                    if(obj!="id"){
                        updateOnDuplicateKey.push(obj)
                    }
                })
                mysql.bulkupdate(perData, {
                    updateOnDuplicate:tableKeys, //["name", 'menus_id', 'link', 'role', 'permission_list', 'category', 'updataData']
                }, results=>{
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"修改成功"
                    })
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
    });
})

module.exports = router;