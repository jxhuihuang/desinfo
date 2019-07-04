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
    switch (_methods){
        //查询方法 
        case "query":
            let {page=0, size=0}=params;
            params=filter(tableKeys, params); //过滤
            // params.upper_id={[Op.ne]:null}
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                deptModel.belongsTo(DicValueModel, {foreignKey: 'upper_id', targetKey:'value',});
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [{
                        model: DicValueModel,
                        attributes: ['name'],
                        where:{prentCode:"unit_category"}
                    }],
                    attributes: ['name'],
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
                        recordsTotal: count
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
            mysql.create(params,result=>{
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                    resultMsg:"新增成功"
                })
            },{res})
        break;
    }
})
module.exports = router;