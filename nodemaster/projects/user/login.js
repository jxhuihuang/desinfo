var express = require('express');
var jwt=require("jsonwebtoken");

var qs = require('qs')
var router = express.Router();
// var Sequelize = require('sequelize');
const {unencodes}=require("../../common/codes")
var DBSQLS = require('../../model/DBSQLS');
// const Op = Sequelize.Op;
let {UserModel, tableKeys}=require('../../model/user')
let {PermissionModel, tableKeys:PertableKeys}=require('../../model/permission')
let {AccountsModel, tableKeys:AccountsTableKeys}=require('../../model/accounts')
let {filter, commons, checkNull, checkLoginPermission}=require('../../common/untils');

var mysql = new DBSQLS(UserModel, tableKeys);
var permsql = new DBSQLS(PermissionModel, PertableKeys);
router.post('/', function(req, res, next) {
    //查询方法 (登录)
    var params =qs.parse(req.body);
    let isremember=params.remember=="1"?true:false;
    params=filter(tableKeys, params); //过滤
   
    let params_loginname=params.username?params.username:"";
    let params_password =params.password?params.password:"";
    req.session.tokens=!req.session.tokens?{}:req.session.tokens;
    // res.cookie("token", newToken,{maxAge: 9000000000000});
    UserModel.belongsTo(AccountsModel, {foreignKey: 'id', targetKey:'user_id'});
    mysql.findAndCountAll({
        raw: true, // 设置为 true，即可返回源数据
        // attributes: ['id', 'username', 'password', 'name', 'phone', 'avatar', 'roles', 'active', 'dept', 'dept_id'],
        include: [{
            model: AccountsModel,
            attributes: ['id','balance'],
        }],
        where:{
            username:params_loginname
        }
    },(result, count)=>{
        let resultData=result[0];
        if(count>0){
            const {username, password, roles, active}=resultData;
            let lastPassword = unencodes(params_password,password); //密码解密
            if (password===lastPassword){
                if(active || active=="1"){
                    var urls=qs.parse(req._parsedOriginalUrl).path
                    let currentUrl=req.headers.currenturl //前端url
                    const webType=urls.indexOf("admin")>0?"admin":urls.indexOf("admin")==-1?"web":""
                    let newresults={id:resultData.id, username:resultData.username, name:resultData.name, phone:resultData.phone, avatar:resultData.avatar, roles:resultData.roles, active:resultData.active, dept:resultData.dept, dept_id:resultData.dept_id}
                    let expiresIn_time=isremember?60*60*24*5:60*60*24;  //过期时间  60*60*24    24小时过期
                      
                    switch(webType){
                        //前台
                        case "web":
                            delete resultData.user_passwoqrd;
                            let content =resultData; // 要生成token的主题信息
                            let secretOrPrivateKey=commons.tokenKey // 这是加密的key（密钥）
                            let newToken = jwt.sign(content, secretOrPrivateKey, {
                                expiresIn: expiresIn_time   
                            });
                            resultData.token=newToken;
                            newresults.token=newToken;
                            req.session.tokens[username]=newToken;
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                resultMsg:"登录成功",
                                total:count,
                                data:newresults,
                            })
                        break;
                        //后台
                        case "admin":
                            checkLoginPermission(req, res, jwt, permsql, roles, function(permissionObj){
                                let permission=permissionObj.permission;
                                if(!permission){
                                    res.json({
                                        code: '200',
                                        resultCode:"14",
                                        success:"false",
                                        resultMsg:"用户权限不足"
                                    })
                                }else{
                                    delete resultData.user_passwoqrd;
                                    let content =resultData; // 要生成token的主题信息
                                    let secretOrPrivateKey=commons.tokenKey // 这是加密的key（密钥）
                                    let newToken = jwt.sign(content, secretOrPrivateKey, {
                                        expiresIn: expiresIn_time  
                                    });
                                    resultData.token=newToken;
                                    newresults.token=newToken;
                                    req.session.tokens[username]=newToken;
                                    res.json({
                                        code: '200',
                                        resultCode:"0",
                                        success:"true",
                                        resultMsg:"登录成功",
                                        total:count,
                                        data:newresults,
                                    })
                                    return false;
                                }
                            })
                        break;
                    }
                    
                }else if(!active || active=="0"){
                    res.json({
                        code: '200',
                        resultCode:"12",
                        success:"false",
                        resultMsg:"用户还在审核中"
                    })
                }else if(active=="-1"){
                    res.json({
                        code: '200',
                        resultCode:"14",
                        success:"false",
                        resultMsg:"用户已被停用"
                    })
                }
            }else{
                res.json({
                    code: '200',
                    resultCode:"10",
                    success:"false",
                    resultMsg:"用户名或密码错误"
                })
            }
        }else{
            //用户不存在
            res.json({
                code: '200',
                resultCode:"11",
                success:"false",
                resultMsg:"用户名或密码错误"
            })
        }
    },{res})
})
module.exports = router;