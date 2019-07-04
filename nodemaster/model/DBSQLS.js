var Sequelize = require('sequelize');
var qs = require('qs')
let { commons, checkNull, removeNull, indexof}=require('../common/untils');
function DBSQLS(dbname, arguments) {
    this.arguments = arguments
    
    var that = this
    
    /*  查询数据并统计数量 */
    this.findAndCountAll=function(objs, callback, {res, erroClallback=function(){}}={}) {
        var keys=this.arguments
        // objs.raw=objs.raw?objs.raw:true, // 设置为 true，即可返回源数据
        // console.log("objs.raw:",objs.raw)
        dbname.findAndCountAll(objs).then((result)=>{
            result=JSON.parse(JSON.stringify(result))
            const count=result.count;
            let resultData=result.rows;
            callback(resultData,count)
         }).catch(erro=>{
            setErro(erro,function(erroObj){
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }
    /*  只查询数据 */
    this.findAll=function(objs, callback, {res, erroClallback=function(){}}={}) {
        var keys=this.arguments
        // objs.raw=objs.raw?objs.raw:true, // 设置为 true，即可返回源数据
        dbname.findAll(objs).then(resdata=>{
            callback(resdata)
         }).catch(erro=>{
            setErro(erro,function(erroObj){
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }
    /*  查询数据(综合)  */
    this.query=function(objs, callback, {res, erroClallback=function(){}}={}){
        objs=objs?objs:{}
        var keys=this.arguments
        let params=objs.where?objs.where:{};
        let ispage=true;
        if(checkNull(objs.limit) || checkNull(objs.offset)){
                ispage=false;
                delete objs.limit;
                delete objs.offset;
        }
        if(ispage){
            dbname.findAndCountAll(objs).then((result)=>{
                result=JSON.parse(JSON.stringify(result))
                const count=result.count;
                let resultData=result.rows;
                callback(resultData,count)
             }).catch(erro=>{
                setErro(erro,function(erroObj){
                    res.json(erroObj)
                    erroClallback(erroObj)
                })
            })
        }else{
            dbname.findAll(objs).then(resdata=>{
                callback(resdata,"")
             }).catch(erro=>{
                setErro(erro,function(erroObj){
                    res.json(erroObj)
                    erroClallback(erroObj)
                })
            })
        }

    }
    /********        新增     *************/

    this.create=function(objs, callback, {res, uniqueText="", erroClallback=function(){}}={}){
        dbname.create(objs).then(resdata=>{
            callback(resdata)
         }).catch(erro=>{
            setErro(erro,function(erroObj){
                let {resultCode=""}=erroObj;
                if(resultCode=="16" && uniqueText !=""){
                    erroObj.resultMsg=uniqueText;
                }
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }

    this.findOrCreate=function(objs, callback, {res, uniqueText="", erroClallback=function(){}}={}){
        dbname.findOrCreate(objs).then(resdata=>{
            callback(resdata)
         }).catch(erro=>{
            setErro(erro,function(erroObj){
                let {resultCode=""}=erroObj;
                if(resultCode=="16" && uniqueText !=""){
                    erroObj.resultMsg=uniqueText;
                }
                res.json(erroObj)
                erroClallback(erroObj)
            })
            
           
        })
    }
    /**
     * 例子
     *  mysql.findOrCreate({
                    where:{approval_number:params.approval_number},
                    defaults:params
                },(result,)=>{
                    result=JSON.parse(JSON.stringify(result));
                    let created=result[1]
                    if(created){
                        res.json({
                            code: '200',
                            resultCode:"0",
                            success:"true",
                            resultMsg:"新增成功"
                        })
                    }else{
                        res.json({
                            code: '200',
                            resultCode:"24",
                            success:"false",
                            resultMsg:"药品已存在"
                        })
                    }
                    
    
                },{res, uniqueText:"批准文号已存在"})
     */
    /***  插入多条 ****/
    this.bulkCreate=function(objs, callback, {res, uniqueText="", erroClallback=function(){}}={}){
        dbname.bulkCreate(objs).then(resdata=>{
            callback(resdata)
         }).catch(erro=>{
            setErro(erro,function(erroObj){
                let {resultCode=""}=erroObj;
                if(resultCode=="16" && uniqueText !=""){
                    erroObj.resultMsg=uniqueText;
                }
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }


    /*** 修改 */
    
    this.update=function(objs, indexObj, callback, {res, uniqueText="",erroClallback=function(){}}={}){
        var keys=this.arguments
        indexof(keys,"updataData")?objs.updataData=new Date():"";
        
        dbname.update(objs, indexObj).then(resdata=>{
            callback(resdata)
        }).catch(erro=>{
            setErro(erro,function(erroObj){
                let {resultCode=""}=erroObj;
                if(resultCode=="16" && uniqueText !=""){
                    erroObj.resultMsg=uniqueText;
                }
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }
    /***  修改多条 ****/
    this.bulkupdate=function(objs,OnDuplicate, callback, {res, uniqueText="", erroClallback=function(){}}={}){
        dbname.bulkCreate(objs,OnDuplicate).then(resdata=>{
            callback(resdata)
        }).catch(erro=>{
            setErro(erro,function(erroObj){
                let {resultCode=""}=erroObj;
                if(resultCode=="16" && uniqueText !=""){
                    erroObj.resultMsg=uniqueText;
                }
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }
    /***删除 */
    this.delete=function(objs, callback, {res, erroClallback=function(){}}={}){
        dbname.destroy(objs).then(resdata=>{
            callback(resdata)
        }).catch(erro=>{
            setErro(erro,function(erroObj){
                res.json(erroObj)
                erroClallback(erroObj)
            })
        })
    }
}

function setErro(erro,callback){
    callback=callback?callback:function(){};
    console.log("错误：", erro)
    erro= JSON.parse(JSON.stringify(erro));
    
    if(erro.name=="SequelizeUniqueConstraintError"){
        let errors=erro.errors[0];
        let path=errors.path;
        let value=errors.value;
        let erroText="'"+value+"' 已存在"
        callback({
            code: '200',
            success:"false",
            resultCode:"16",
            resultMsg:erroText,
        })
       
    }else{
        if(Object.getOwnPropertyNames(erro).length<=0){
            callback({
                code: '500',
                success:"false",
                resultMsg:"",
            })
        }else{
            let erroText=erro.Error?erro.Error:erro
            callback({
                code: '500',
                success:"false",
                resultMsg:"接口错误"//erro.Error?erro.Error:erro,
            })
        }
        
        
    }
}


module.exports = DBSQLS;