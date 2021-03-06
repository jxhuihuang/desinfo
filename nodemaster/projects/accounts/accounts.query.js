//用户账户
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {AccountsModel, tableKeys}=require('../../model/accounts')
let {PermissionModel, tableKeys:pertableKeys}=require('../../model/permission')
let {filter}=require('../../common/untils');
var mysql = new DBSQLS(AccountsModel, tableKeys);
let permysql=new DBSQLS(PermissionModel, pertableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    switch (_methods){
        //查询方法 
        case "query":
            let {page=0, size=0}=params;
            params=filter(tableKeys, params); //过滤
            let prmissions=req.session.permission;
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
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
                // params.id={[Op.not]:"7"};
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
            params=filter(tableKeys, params); //过滤
            mysql.findAndCountAll({
                where:{name:params.name}
            },(result,count)=>{
                if(count>0){
                    res.json({
                        code: '200',
                        resultCode:"24",
                        success:"false",
                        resultMsg:"角色已存在"
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
            mysql.findAndCountAll({
                where:{
                    name:params.name,
                    id:{[Op.ne]:params.id}
                }
            },(result,count)=>{
                if(count>0){
                    res.json({
                        code: '200',
                        resultCode:"24",
                        success:"false",
                        resultMsg:"用户已存在"
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
        //走修改 不判断重复
        case "updatas":
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
        break;

        case "delete":
            params=filter(tableKeys, params); //过滤
            mysql.delete({
                where:params,
            },function(result){
                permysql.delete({
                    where:{role:params.id}
                },(result)=>{
                    result=JSON.parse(JSON.stringify(result))
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"删除成功"
                    })
                },{res})
            },{res:res})
        break
    }
})

module.exports = router;