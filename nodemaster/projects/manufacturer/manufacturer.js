var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {ManufacturerModel, tableKeys}=require('../../model/manufacturer')
let {filter, stringToArry, checkNull}=require('../../common/untils');
var mysql = new DBSQLS(ManufacturerModel, tableKeys);
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
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    attributes: keys,
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
                    attributes: keys,
                    order:[['createData', 'ASC']],
                    where:params
                },(result)=>{
                    result=JSON.parse(JSON.stringify(result));
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        data: result,
                    })
                },{res})
            }
            
        break;
      

        
        
    }
})

module.exports = router;