var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var jwt=require("jsonwebtoken");
var qs = require('qs')
var DBSQLS = require('../../model/DBSQLS');
// var URL = require('url');
const {encodes}=require("../../common/codes")
let {UserModel, tableKeys}=require('../../model/user')
let {AccountsModel, tableKeys:AccountsTableKeys}=require('../../model/accounts')
var mysql = new DBSQLS(UserModel, tableKeys);
let accountsMysql = new DBSQLS(AccountsModel, AccountsTableKeys);
let {filter, commons, checkNull}=require('../../common/untils');
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    var params =qs.parse(req.body);
    params=filter(tableKeys, params); //过滤
    params.password = encodes(params.password); //密码加密
    params.active="0";
    let opOr=[] //新增修改时判断是否存在
    //新增修改时判断是否存在
    !checkNull(params.username) && opOr.push({username:params.username});
    !checkNull(params.phone) && opOr.push({phone:params.phone});
    !checkNull(params.email) && opOr.push({email:params.email});
    mysql.findAndCountAll({
        raw: true, // 设置为 true，即可返回源数据
        where:{
            [Op.or]: opOr
        }
    },(resdata, count)=>{
        const total=count?count:0;
        if(total>0){
            res.json({
                code: '200',
                resultCode:"24",
                success:"false",
                resultMsg:"用户、手机、邮箱已存在"
            })
        }else{
            mysql.create(params,results=>{
                results=JSON.parse(JSON.stringify(results));
                var accountParam={}
                accountParam.password=encodes(commons.defalut_password);//密码加密
                accountParam.balance=0;
                accountParam.user_id=results.id;
                accountsMysql.create(accountParam,accountsresult=>{
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"注册成功",
                    })
                },{res})
            })
        }
    },{res})
})
module.exports = router;