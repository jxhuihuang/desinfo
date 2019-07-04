var express = require('express');
var {jwtVerify, commons}=require('../../common/untils');
var jwt=require("jsonwebtoken")
var qs = require('qs')
var router = express.Router();
router.post('/', function(req, res, next) {
    let params =qs.parse(req.body)
    const _methods=params._methods?params._methods:"query";
    switch (_methods){
      case "query":
        //查询方法 (登出)
        let param_token=req.headers.tokens; //前端获取的token
        var session_token=req.session.tokens //后端保存的token
        jwtVerify(req, jwt,function(decode){
          if(!decode.logonType){
            res.json({
                code: '200',
                resultCode:"26",
                success:"false",
                resultMsg:"用户已经过期"
            })           
          }else{
            
            session_token?delete session_token[decode.username]:"";
            res.json({
                code: '200',
                resultCode:"0",
                success:"true",
                resultMsg:"登出成功"
            })     
          }
        })
        // res.cookie("token", newToken,{maxAge: 9000000000000});
      break;
    }
})
module.exports = router;