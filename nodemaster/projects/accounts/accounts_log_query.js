//用户账户记录
var express = require('express');
var DBSQLS = require('../../model/DBSQLS');
var router = express.Router();
var Sequelize = require('sequelize');
var qs = require('qs')
// var URL = require('url');
let {AccountsLogModel, tableKeys}=require('../../model/accountsLog')
let {AccountsModel, tableKeys:AccountsTablekeys}=require('../../model/accounts')
let {UserModel, tableKeys:UserTableKeys}=require('../../model/user')
let {filter}=require('../../common/untils');
var mysql = new DBSQLS(AccountsLogModel, tableKeys);
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
            AccountsLogModel.belongsTo(AccountsModel, {foreignKey: 'account_id', targetKey:'id'});
            AccountsModel.belongsTo(UserModel, {foreignKey: 'user_id', targetKey:'id'});
            if(page!=0 && size!=0){
                let limit=parseInt(size);
                let offset=(page-1)*limit;
                mysql.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    attributes: ['id','account_id','mode','balance_before','balance_after','report_id','created_at','amount','state'],
                    include: [{
                        model: AccountsModel,
                        attributes: ['user_id'],
                        include: [{
                            model: UserModel,
                           
                            attributes: ['name'],
                        }]
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
                // params.id={[Op.not]:"7"};
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
        case "review":
            params=filter(tableKeys, params); //过滤
            mysql.update(params,{
                where :{id:params.id}
            },result=>{
                res.json({
                    code: '200',
                    resultCode:"0",
                    success:"true",
                    resultMsg:"审核成功"
                })
            },{res})
        break;
        case "delete":
            params=filter(tableKeys, params); //过滤
            mysql.delete({
                where:params,
            },function(result){
                permysql.delete({
                    where:{role:params.id}
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