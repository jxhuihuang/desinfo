var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {deptModel, tableKeys}=require('../../model/dept')
let {DicValueModel, tableKeys:dictableKeys}=require('../../model/dictionaryData')
let {filter}=require('../../common/untils');
var mysql = new DBSQLS(deptModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    let prmissions=req.session.permission;
    switch (_methods){
        //查询方法 
        case "query":
            let {page=0, size=0}=params;
            params=filter(tableKeys, params); //过滤
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                deptModel.belongsTo(DicValueModel, {foreignKey: 'upper_id', targetKey:'value',});
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    // distinct: true,
                    include: [{
                        model: DicValueModel,
                        attributes: ['name'],
                        where:{prentCode:"unit_category"}
                    }],
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
                        resultMsg:"组织机构已存在"
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
                        resultMsg:"组织机构已存在"
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