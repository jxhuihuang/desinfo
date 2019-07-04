var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var jwt=require("jsonwebtoken")
const {encodes}=require("../../common/codes");
var qs = require('qs')
// var URL = require('url');
let {UserModel, tableKeys}=require('../../model/user')
let {AccountsModel, tableKeys:AccountsTableKeys}=require('../../model/accounts')
let {RoleModel, tableKeys:roletableKeys}=require('../../model/role')
let {filter, jwtVerify, commons, checkNull, stringToArry}=require('../../common/untils');
var mysql = new DBSQLS(UserModel, tableKeys);
let accountsMysql = new DBSQLS(AccountsModel, AccountsTableKeys);

const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    let prmissions=req.session.permission;
    let opOr=[] //新增修改时判断是否存在
    jwtVerify(req, jwt,function(decode){
        switch (_methods){
            //查询方法 
            case "query":
                if(decode.logonType){
                    const user_role=decode.roles;
                    let {page=0, size=0}=params;
                    let keys=params.keys;
                    let attributesKey=checkNull(params.keys)?{ exclude: ['password'] }:stringToArry(keys) 
                    let ispage=page!=0 && size!=0?true:false; //是否分页
                    let limit="";
                    let offset="";
                    UserModel.belongsTo(AccountsModel, {foreignKey: 'id', targetKey:'user_id'});
                    params=filter(tableKeys, params); //过滤
                    if(ispage){ //分页查询
                        limit=parseInt(size);
                        offset=(page-1)*limit;
                        if(user_role!=commons.admin_id){
                            params.roles={[Op.not]:commons.admin_id};
                        }
                    }
                    mysql.query({
                        include: [{
                            model: AccountsModel,
                            attributes: ['id','balance'],
                        }],
                        limit:limit,
                        offset:offset,
                        order:[['createData', 'ASC']],
                        attributes: attributesKey,
                        where:params
                    },(result,count)=>{
                        if(page!=0 && size!=0){
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                data: result,
                                draw: page,
                                recordsFiltered: count,
                                prmissions:prmissions,
                            })
                        }else{
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                data: result,
                            })
                        }
                    })
                }else{
                    res.json({
                        code: '200',
                        resultCode:"14",
                        success:"false",
                        resultMsg:"用户权限不足"
                    })
                }
            break;
            case "queryUser":
                //查询当前用户信息
                UserModel.belongsTo(AccountsModel, {foreignKey: 'id', targetKey:'user_id'});
                let userId=decode.id;
                let keys=params.keys
                let attributesKey=checkNull(params.keys)?{ exclude: ['password'] }:stringToArry(keys) 
                params=filter(tableKeys, params); //过滤
                params.id=userId
                if(decode.logonType){
                    mysql.findAll({
                        include: [{
                            model: AccountsModel,
                            attributes: ['id','balance'],
                        }],
                        order:[['createData', 'ASC']],
                        attributes:attributesKey,
                        where:params
                    },(result)=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            data: result,
                            
                        })
                    },{res})
                }else{
                    res.json({
                        code: '200',
                        resultCode:"14",
                        success:"false",
                        resultMsg:"用户权限不足"
                    })
                }
            break;
            case "updata":
                let {accounts_id="", account_balance, account_password}=params;
                params=filter(tableKeys, params); //过滤
                if(!checkNull(params.password)){
                    params.password = encodes(params.password); //密码加密
                }else{
                    delete params.password;
                }
                
                params.updataData=new Date();
                //新增修改时判断是否存在
                !checkNull(params.username) && opOr.push({username:params.username});
                !checkNull(params.phone) && opOr.push({phone:params.phone});
                !checkNull(params.email) && opOr.push({email:params.email});
                mysql.findAndCountAll({
                    where:{
                        [Op.or]:opOr
                    }
                },(result,count)=>{
                    result=JSON.parse(JSON.stringify(result));
                    let newresults=[];
                    result.map((obj)=>{
                        if(obj.id!=params.id){
                            newresults.push(obj)
                        }
                    })
                    if(newresults.length>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"用户、手机、邮箱已存在"
                        })
                    }else{
                        mysql.update(params,{
                            where :{id:params.id}
                        },result=>{
                            var accountParams={}
                            if(!checkNull(account_password) || !checkNull(account_balance)){
                                //修改用户账号
                                if(!checkNull(account_password)){
                                    accountParams.password=encodes(account_password);//密码加密
                                }
                                if(!checkNull(account_balance)){
                                    accountParams.balance=account_balance;
                                }
                                accountParams.user_id=params.id;
                                if(accounts_id==""){  
                                    //不存在id 则新增
                                    accountsMysql.create(accountParams,result=>{
                                        res.json({
                                            code: '200',
                                            resultCode:"0",
                                            success:"true",
                                            resultMsg:"修改成功"
                                        })
                                    },{res})
                                }else{
                                    //存在id 则修改
                                    accountParams.id=accounts_id;
                                    accountParams.updataData=new Date()
                                    accountsMysql.update(accountParams,{
                                        where :{id:accounts_id}
                                    },result=>{
                                        res.json({
                                            code: '200',
                                            resultCode:"0",
                                            success:"true",
                                            resultMsg:"修改成功"
                                        })
                                    },{res})
                                }
                            }else{
                                res.json({
                                    code: '200',
                                    resultCode:"0",
                                    success:"true",
                                    resultMsg:"修改成功"
                                })
                            }
                        },{res})
                    }
                },{res})
            break;
        }

    })
    
})

module.exports = router;