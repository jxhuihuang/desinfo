var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
var jwt=require("jsonwebtoken")
// var URL = require('url');
let {ManufacturerModel, tableKeys}=require('../../model/manufacturer')
let {filter,jwtVerify}=require('../../common/untils');
var mysql = new DBSQLS(ManufacturerModel, tableKeys);
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
                    mysql.findAll({
                        order:[['createData', 'ASC']],
                        where:params
                    },(result)=>{
                        result=JSON.parse(JSON.stringify(result));
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
                    where:{organization_code:params.organization_code}
                },(result,count)=>{
                    if(count>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"生产厂家已存在"
                        })
                    }else{
                        let decodes=decode;
                        params.dept_id=decodes.dept_id;
                        mysql.create(params,result=>{
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                resultMsg:"新增生产厂家成功"
                            })
                        },{res})
                    }
                },{res})
            break;

            case "updata":
                params=filter(tableKeys, params); //过滤
                mysql.findAndCountAll({
                    where:{
                        organization_code:params.organization_code,
                        id:{[Op.ne]:params.id}
                    }
                },(result,count)=>{
                    if(count>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"生产厂家已存在"
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