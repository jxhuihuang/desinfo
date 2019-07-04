var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {RoleModel, tableKeys}=require('../../model/role')
let {PermissionModel, tableKeys:pertableKeys}=require('../../model/permission')
let {filter, commons}=require('../../common/untils');
var mysql = new DBSQLS(RoleModel, tableKeys);
let permysql=new DBSQLS(PermissionModel, pertableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    switch (_methods){
        //查询方法 
        case "query":
            params=filter(tableKeys, params); //过滤
            let prmissions=req.session.permission;
            
            params.id={[Op.not]:commons.admin_id};
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
    }
})

module.exports = router;