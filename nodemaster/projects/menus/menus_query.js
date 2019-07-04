/*** 菜单管理 ****/
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {MenusModel, tableKeys}=require('../../model/menus')
let {PermissionModel, tableKeys:pertableKeys}=require('../../model/permission')
let {filter, checkNull}=require('../../common/untils');
var mysql = new DBSQLS(MenusModel, tableKeys);
let permysql=new DBSQLS(PermissionModel, pertableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    let prmissions=req.session.permission;
    switch (_methods){
        //查询方法 
        case "query":
            let {page=0, size=0}=params;
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                params=filter(tableKeys, params); //过滤
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
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        data: result,
                    })
                },{res})
            }
        break;
        //权限数据菜单
        case "perquery":
            params=filter(tableKeys, params); //过滤
            params.purview_menu={[Op.ne]:""}
            mysql.findAll({
                order:[['seq', 'ASC']],
                attributes: ['category', 'link', 'name', 'parent', 'category',  'purview_menu', 'id' ],
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
        case "insert":
            params=filter(tableKeys, params); //过滤
            mysql.findAndCountAll({
                where:{link:params.link}
            },(result,count)=>{
                if(count>0){
                    res.json({
                        code: '200',
                        resultCode:"24",
                        success:"false",
                        resultMsg:"链接已存在"
                    })
                }else{
                    mysql.create(params,result=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            resultMsg:"新增菜单管理成功"
                        })
                    },{res})
                }
            },{res})
        break;
        case "updata":
            params=filter(tableKeys, params); //过滤
            let purview_menu=params.purview_menu;
            params.updataData=new Date();
            mysql.findAndCountAll({
                where:{
                    link:params.link,
                    id:{[Op.ne]:params.id}
                }
            },(result,count)=>{
                if(count>0){
                    res.json({
                        code: '200',
                        resultCode:"24",
                        success:"false",
                        resultMsg:"菜单已存在"
                    })
                }else{
                    mysql.update(params,{
                        where :{id:params.id}
                    },result=>{
                        if(checkNull(purview_menu)){
                            permysql.delete({
                                where:{menus_id:params.id}
                            },(result)=>{
                                result=JSON.parse(JSON.stringify(result))
                                res.json({
                                    code: '200',
                                    resultCode:"0",
                                    success:"true",
                                    resultMsg:"修改成功"
                                })
                            },{res})
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
      
        case "delete":
            params=filter(tableKeys, params); //过滤
            MenusModel.belongsTo(PermissionModel, {foreignKey: 'id', targetKey:'menus_id'});
            mysql.delete({
                where:params,
            },function(result){
                permysql.delete({
                    where:{menus_id:params.id}
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