var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
var jwt=require("jsonwebtoken")
// var URL = require('url');
let {ArticlesModel, tableKeys}=require('../../model/articles')
let {DicValueModel, tableKeys:DicTableKeys}=require('../../model/dictionaryData')  
let {filter,  jwtVerify}=require('../../common/untils');
var mysql = new DBSQLS(ArticlesModel, tableKeys);
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
                ArticlesModel.belongsTo(DicValueModel, {foreignKey: 'category_id', targetKey:'value'});
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [{
                        model: DicValueModel,
                        attributes: ['name'],
                    }],
                    order:[['created_at', 'ASC']],
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
                    order:[['created_at', 'ASC']],
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
            jwtVerify(req, jwt,function(decode){
                var userId=decode.id;
                // params=filter(tableKeys, params); //过滤
                params.author_id=userId;
                mysql.create(params,result=>{
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"新增成功"
                    })
                },{res})
            })
        break;
        case "updata":
            params=filter(tableKeys, params); //过滤
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

module.exports = router;