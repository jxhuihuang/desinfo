/*** 菜单管理 ****/
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var jwt=require("jsonwebtoken");
var qs = require('qs')
const Op = Sequelize.Op;
let {PermissionModel, tableKeys}=require('../../model/permission')
let {jwtVerify, commons, checkNull,  filter, checkPermission, stringToArry, mergePermission, removeNull}=require('../../common/untils');
var mysql = new DBSQLS(PermissionModel, tableKeys);
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    var urls=req.baseUrl;
    urls=urls.indexOf("?")>0?urls.split("?")[0]:urls;
    let currentUrl=req.headers.currenturl //前端url
    currentUrl=checkNull(currentUrl)?"index":currentUrl;
    currentUrl=currentUrl=="/admin"?"/admin/dashboard":currentUrl
    const webType=currentUrl.indexOf("admin")>0?"admin":currentUrl.indexOf("admin")==-1?"web":"";
    switch(webType){
        case "admin":
            checkPermission(req, res, jwt, mysql, currentUrl, function(permissionRes){
                if(!permissionRes.islogin){
                    res.json({
                        code: '200',
                        resultCode:"13",
                        success:"false",
                        resultMsg:"用户已经过期"
                    })
                }else{
                    let navColumns=params.navColumns;
                    params=filter(tableKeys, params); //过滤
                    params.category=!params.category?"admin":params.category;
                    const {username="", roles=""}=permissionRes.decode;
                    let user_role=roles;
                    if(user_role.toString().indexOf(",")!=-1){
                        user_role={[Op.or]:stringToArry(user_role)};
                    }
                    params.role=user_role;
                    mysql.findAll({
                        order:[['createData', 'ASC']],
                        attributes:["name",'link', 'permission_list'],
                        where:params
                    },(result)=>{
                        result=result?JSON.parse(JSON.stringify(result)):{};
                        result=mergePermission(result); //整合权限 把相同链接的权限合并
                        adminSetpermission(navColumns, result, function(newColumnsArry){
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                result:newColumnsArry,
                                userName:username,
                                roles:roles,
                                islogin:permissionRes.islogin,
                                permission:permissionRes.permission,
                                permissionErro:permissionRes.resultCode,
                                permission_list:permissionRes.permission_list,
                            })             
                        })
                       
                        
                    })
                }
            })
        break;
        //前台
        case "web":
            
            let navColumns=params.navColumns;
            params=filter(tableKeys, params); //过滤
            params.category=!params.category?"portal":params.category;
            checkPermission(req, res, jwt, mysql, currentUrl,  function(permissionRes){
                const {username="", roles="", active="", unit_category=""}=permissionRes.decode;
                let user_role=roles;
                if(user_role.toString().indexOf(",")!=-1){
                    user_role={[Op.or]:stringToArry(user_role)};
                }
                permissionRes.islogin?params.role=user_role:"";
                mysql.findAll({
                    order:[['createData', 'ASC']],
                    attributes:["name",'link', 'permission_list'],
                    where:params
                },(result)=>{
                    result=result?JSON.parse(JSON.stringify(result)):{};
                    let islogin=permissionRes.islogin;
                    //整合权限
                    var permissionArry=[]
                    result=mergePermission(result); //整合权限 把相同链接的权限合并
                    setpermission(navColumns, result, islogin, unit_category, function(newColumnsArry){
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            result:newColumnsArry,
                            userName:username,
                            roles:roles,
                            islogin:permissionRes.islogin,
                            permission:permissionRes.permission,
                            permissionErro:permissionRes.resultCode,
                            permission_list:permissionRes.permission_list,
                            active:active
                        })           
                    })
                     
                })
            })

        break;
    }
})

/* 为 前台导航栏添加权限字段*/
function setpermission(navColumns, result, islogin, unit_category, callBack){
     // result.push({
    //     name:"填写规范",
    //     link:"/report/standard",
    //     permission_list:"",
    // })
    //整合权限
    
    var permissionArry=[]
    if(!islogin){
        result.map(function(objs){
            objs.permission_list=[]  //存在权限设置的 未登录都无权限访问
        })
        permissionArry=result
    }else{
        permissionArry=result;
    }
    var permissionobj={};
    permissionArry.map(function(obj){
        var link=removeNull(obj.link);
        permissionobj[link]=obj.permission_list;

    })

    //设置权限
    
    var navColumnsArry=stringToArry(navColumns)
    
    var newColumnsArry=[];
    navColumnsArry.map((obj)=>{
        if(!permissionobj[obj]){
            newColumnsArry.push(obj)
        }else{
            if(permissionobj[obj].indexOf("query")==-1){
               
            }else{
                newColumnsArry.push(obj)
            }
        }
    })
   
    
    var newColumnsArrys=[];
    newColumnsArry.map(function(obj){
        if(obj.indexOf("drug")!=-1){
            if(unit_category=="生产企业"){
                newColumnsArrys.push(obj)
            }
        }else{
            newColumnsArrys.push(obj)
        }
    })
    newColumnsArrys=newColumnsArrys.length>0?newColumnsArrys.join(","):"";
    callBack(newColumnsArrys)
 
}

function adminSetpermission(navColumns, result, callBack){
    //整合权限
    var permissionobj={};
    result.map(function(obj){
        var link=removeNull(obj.link);
        permissionobj[link]=obj.permission_list;
    })
    //设置权限
    
    var navColumnsArry=stringToArry(navColumns)
    
    var newColumnsArry=[];
    navColumnsArry.map((obj)=>{
        if(!permissionobj[obj]){
            // newColumnsArry.push(obj)
        }else{
            if(permissionobj[obj].indexOf("query")==-1){
               
            }else{
                newColumnsArry.push(obj)
            }
        }
    })
    newColumnsArry=newColumnsArry.length>0?newColumnsArry.join(","):"";

    callBack(newColumnsArry)

}
module.exports = router;