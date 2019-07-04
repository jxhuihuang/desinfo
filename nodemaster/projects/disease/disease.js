//用户账户
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {DiseaseModel, tableKeys}=require('../../model/disease')
let {filter, checkNull}=require('../../common/untils');
var mysql = new DBSQLS(DiseaseModel, tableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body);
    let _methods=params._methods?params._methods:"query";
    switch (_methods){
        //查询方法 
        case "query":
            let {page=0, size=0}=params;
            let attributesKey=checkNull(params.keys)?tableKeys:stringToArry(params.keys) 
            let ispage=page!=0 && size!=0?true:false; //是否分页
            let limit=ispage?parseInt(size):"";
            let offset=ispage?(page-1)*limit:"";
            params=filter(tableKeys, params); //过滤
            let prmissions=req.session.permission;
            mysql.query({
                limit:limit,
                offset:offset,
                order:[['createData', 'ASC']],
                attributes: attributesKey,
                where:params
            },(result,count)=>{
                if(ispage){
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
            },res)
        break;
    }
})

module.exports = router;