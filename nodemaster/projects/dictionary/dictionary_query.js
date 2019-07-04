/**数字字典*/
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var URL = require('url');
var qs = require('qs')
var router = express.Router();
var Sequelize = require('sequelize');
let {DictionaryModel, tableKeys}=require('../../model/dictionary')
let {DicValueModel, tableKeys:DicTableKeys}=require('../../model/dictionaryData')
let {filter, dealparams}=require('../../common/untils');
var mysql = new DBSQLS(DictionaryModel, tableKeys);
var mysqls=new DBSQLS(DicValueModel, DicTableKeys);
const Op = Sequelize.Op;
router.post('/', function(req, res, next) {
    var params =qs.parse(req.body)
    const _methods=params._methods?params._methods:"query";
    switch (_methods){
        //查询方法
        case "query":
            let {page=0, size=0}=params;
            if(page!=0 && size!=0){  //分页列表
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                params=filter(tableKeys, params); //过滤
                let prmissions=req.session.permission;
                mysql.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        where:params
                    },(result,count)=>{
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            data: result, 
                            recordsFiltered: count,
                            recordsTotal: count,
                            prmissions:prmissions,
                        })
                },{res})
            }else{
                var order=params.order?params.order:"seq";
                params=filter(tableKeys, params); //过滤
                // DictionaryModel.hasMany(DicValueModel, {foreignKey: 'parentId', targetKey:'id'})
                // DicValueModel.belongsTo(DictionaryModel, {foreignKey: 'parentId', targetKey:'id'}); 

                DictionaryModel.hasMany(DicValueModel, {foreignKey: 'parentId', targetKey:'id'})
                DictionaryModel.belongsTo(DicValueModel, {foreignKey: 'id', targetKey:'parentId'}); 

                mysql.findAll({
                    distinct: true,
                    include: [
                        {
                            model: DicValueModel,
                            // as:'dicList',
                        // where: { parentId: Sequelize.col(DictionaryModel['id']) }
                        },
                    ],
                    order:[[DicValueModel, order, 'ASC']],
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

        //新增方法
        case "insert":
            var value_params =params.values?params.values:""
            var order=params.order;
            
            mysql.findAndCountAll({
                where:{code:params.code}
            },(result,count)=>{
                if(count>0){
                    res.json({
                        code: '200',
                        resultCode:"22",
                        success:"false",
                        resultMsg:"字典已存在"
                    })
                }else{
                    if(value_params!=""){
                        let valueParams=dealparams(value_params)
                        mysql.create(params,rest=>{
                            valueParams.map(function(obj){
                                obj.parentId=rest.id
                            })
                            mysqls.bulkCreate(valueParams,results=>{
                                res.json({
                                    code: '200',
                                    resultCode:"0",
                                    success:"true",
                                })
                            })
                        },{res})    
                    }else{
                        mysql.create(params,rest=>{
                                res.json({
                                    code: '200',
                                    resultCode:"0",
                                    success:"true",
                                })
                        },{res})    
                    }
                }
            },{res})
            
        break;
        //新增方法
        case "insertdata":
            var value_params =params.diclists
            value_params=dealparams(value_params)
            params=filter(tableKeys, params); //过滤
            mysqls.bulkCreate(value_params,results=>{
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                })
            })
        break;

        case "updata":
            var value_params =JSON.parse(params.values);
            value_params=dealparams(value_params)
            var order=params.order;
            params=filter(tableKeys, params);
            mysql.update(params,{
                where :{
                    id:params.id
                }
            },result=>{
                if(value_params.length<=0){
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                        resultMsg:"修改成功"
                    })
                }else{
                    mysqls.bulkupdate(value_params, {
                        updateOnDuplicate:["name", 'value','seq', 'category'],
                    }, results=>{
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
        
        case "updataVal":
            params=dealparams(params)
            params=filter(DicTableKeys, params); //过滤
            if(params.id && params.id!=""){
                mysqls.findAndCountAll({
                    where:{
                        value:params.value,
                        parentId:params.parentId,
                        id:{[Op.ne]:params.id}
                    }
                },(result,count)=>{
                    if(count>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"字典值已存在"
                        })
                    }else{
                        mysqls.update(params,{
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
                })
            }else{
                mysqls.findAndCountAll({
                    where:{
                        value:params.value,
                        parentId:params.parentId,
                    }
                },(result,count)=>{
                    if(count>0){
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"字典值已存在"
                        })
                    }else{
                        mysqls.create(params,result=>{
                            res.json({
                                code: '200',
                                resultCode:"0",
                                success:"true",
                                resultMsg:"新增成功"
                            })
                        },{res})
                    }
                })
            }  
        break;
        case "delete":
            params=filter(tableKeys, params); //过滤
            mysql.delete({
                where:params,
            },function(result){
                mysqls.delete({
                    where:{parentId:params.id,},
                },function(result){
                    res.json({
                        code: '200',
                        resultCode:"0",
                        success:"true",
                    })
                },{res:res})
            },{res:res})
        break;
        case "deleteVal":
            params=filter(DicTableKeys, params); //过滤
            mysqls.delete({
                where:{id:params.id,},
            },function(result){
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                })
            },{res:res})
        break;
    }
    
})
module.exports = router;