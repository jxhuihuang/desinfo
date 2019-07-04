//药品
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {DrugModel, tableKeys}=require('../../model/drug')
let {filter, stringToArry, checkNull}=require('../../common/untils');
var mysql = new DBSQLS(DrugModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    switch (_methods){
        //查询方法 
        case "query":
            let {page=0, size=0}=params;
            let keys=checkNull(params.keys)?tableKeys:stringToArry(params.keys)
            params=filter(tableKeys, params); //过滤
            let prmissions=req.session.permission;
            params.reward={[Op.ne]:0}
            params.quantity={[Op.ne]:0}
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    attributes: keys,
                    order:[['reward', 'ASC']],
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
                    attributes: keys,
                    order:[['reward', 'ASC']],
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
            mysql.create(params,result=>{
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                    resultMsg:"新增成功"
                })
            },{res, uniqueText:"批准文号已存在"})
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
            },{res, uniqueText:"批准文号已存在"})
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
module.exports = router;