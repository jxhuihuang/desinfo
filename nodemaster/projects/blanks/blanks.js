var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var jwt=require("jsonwebtoken")
const {encodes}=require("../../common/codes");
var qs = require('qs')
// var URL = require('url');
let {BanksModel, tableKeys}=require('../../model/banks')
let {AccountsModel, tableKeys:AccountsTableKeys}=require('../../model/accounts')
let {filter, jwtVerify, commons, checkNull}=require('../../common/untils');
var mysql = new DBSQLS(BanksModel, tableKeys);

const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    let prmissions=req.session.permission;
    jwtVerify(req, jwt,function(decode){
        let {logonType}=decode
        console.log("decode",decode)
        let account_id=decode["account.id"]
        switch (_methods){
            //查询方法 
            case "query":
                if(decode.logonType){
                    let keys=params.keys
                    let attributesKey=checkNull(params.keys)?tableKeys:stringToArry(keys)
                    let {page=0, size=0}=params;
                    let ispage=page!=0 && size!=0?true:false; //是否分页
                    let limit="";
                    let offset="";
                    params.account_id=account_id;
                    params=filter(tableKeys, params); //过滤
                    
                    mysql.query({
                        limit:limit,
                        offset:offset,
                        order:[['createData', 'ASC']],
                        attributes: attributesKey,
                        where:params
                    },(result,count)=>{
                        if(ispage){
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                data: result,
                                page: page,
                                count: count,
                                prmissions:prmissions,
                            })
                        }else{
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                data: result,
                                prmissions:prmissions,
                            })
                        }
                        
                    })
                }
            break;
            case "insert":
                params=filter(tableKeys, params); //过滤
                params.account_id=account_id;
                mysql.findOrCreate({
                    where:{account_id:params.account_id},
                    defaults:params
                },(result,)=>{
                    result=JSON.parse(JSON.stringify(result));
                    let created=result[1]
                    if(created){
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            resultMsg:"新增成功"
                        })
                    }else{
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"银行已存在"
                        })
                    }
                    
                },{res})
               
            break;
            case "updata":
                params=filter(tableKeys, params); //过滤
                // params.updataData=new Date();
                params.account_id=account_id;
                let id=params.id?params.id:""
                if(checkNull(params.id)){
                    //新增
                    mysql.create(params,result=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            resultMsg:"修改成功"
                        })
                    },{res})
                }else{
                    //修改
                    mysql.update(params,{
                        where :{id:params.id}
                    },result=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            resultMsg:"修改成功"
                        })
                    })
                }
            break;
            
            case "delete":
                params=filter(tableKeys, params); //过滤
                mysql.delete({
                    where:params,
                },function(results){
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"删除成功"
                    })
                    
                },{res:res})
            break
        }

    })
    
})

module.exports = router;