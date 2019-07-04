var createError = require('http-errors');
var express = require('express');
var url=require("url");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routesIndx =require('./routes'); //引入路由模块
var session = require('express-session');
var jwt=require("jsonwebtoken")
var qs = require('qs')
var DBSQLS = require('./model/DBSQLS');
var redisStore = require('connect-redis')(session);
var {checkNull, commons,  jwtVerify, checkPermission, getcurrentUrl, checklinkPermission}=require('./common/untils');
var ipdress="http://192.168.11.150"   //http://192.168.11.150:3000/desinfo/querys
var ipdress_port=ipdress+":8000" //带端口客户端ip   //服务器端口3000;
var Sequelize = require('sequelize');
var app = express();
let {PermissionModel, tableKeys:pertableKeys}=require('./model/permission')
var permysql = new DBSQLS(PermissionModel, pertableKeys);

const Op = Sequelize.Op;
//获取参数的中间件
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Origin", ipdress_port);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
//cors跨域设置
var cors = require('cors')
app.use(cors({
    origin: ipdress_port,
    credentials: true
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("singedMyCookie"));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/static',express.static(path.join(__dirname, 'public')));//将文件设置成静态
// app.use(favicon(__dirname + '/public/images/lh.ico'));报错了，不知为何，以后再看
app.use(session({
  secret: "app", // 对session id 相关的cookie 进行签名
  resave: false,
  saveUninitialized: false, // 是否保存未初始化的会话
  store : new redisStore({
      host: 'localhost',
      ttl:18000,
      port: 6379,
      logErrors: true,
  }), //sessionConfig.sessionStore
  cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30
  }
  //sessionConfig.cookie
}))

//验证token 阻止未登录用户
app.use("/des",function (req,res,next) {
  let params =qs.parse(req.body);
  let _methods=params._methods?params._methods:"query";
  var urls=req.url
  urls=urls.indexOf("?")>0?urls.split("?")[0]:urls
  // let param_token=req.headers.tokens; //前端获取的token
  // var session_token=req.session.tokens//后端保存的token
  let currentUrl=req.headers.currenturl //前端url
  currentUrl=getcurrentUrl(currentUrl)
  const webType=urls.indexOf("admin")>0?"admin":urls.indexOf("admin")==-1?"web":""
  let adminExcludeUrl=["/admin/login", "/admin/permissionck",'/admin/systems'] //后端排除的接口
  let webExcludeUrl=["/login", "/permissionck",'/logout']  //前端排除的接口
  var excludeUrl=webType=="admin"?adminExcludeUrl:webType=="admin"?webExcludeUrl:[];
  if(excludeUrl.includes(urls)){
    next(); //跳过设定跳过页面的判断
    return false;
  } 
  if(currentUrl==""){
    checklinkPermission(req, jwt, permysql, _methods, function(obj){
      if(webType=="admin" && !obj.islogin){ //后台未登录
        res.json({
          code: '200',
          resultCode:"13",
          success:"false",
          resultMsg:"用户已经过期"
        })
        return false;
      }
      if(obj.permission){
        next(); 
        return false;
      }else{
        res.json({
          code: '200',
          resultCode:obj.resultCode,
          success:"false",
          resultMsg:obj.resultText?obj.resultText:"用户已经过期"
        })
      }
    })

  }else{
    checkPermission(req, res, jwt, permysql, currentUrl, function(obj){
      req.session.decode=obj.decode;

      if(webType=="admin" && !obj.islogin){ //后台未登录
          req.session.permission=[];
          res.json({
            code: '200',
            resultCode:"13",
            success:"false",
            resultMsg:"用户已经过期"
          })
          return false;
      }
      if(obj.permission){
        req.session.permission=obj.permission_list;
        next(); 
        return false;
      }else{
        req.session.permission=[];
        res.json({
          code: '200',
          resultCode:obj.resultCode,
          success:"false",
          resultMsg:obj.resultText?obj.resultText:"用户已经过期"
        })
      }
    })

  }

})

app.use('/des', routesIndx);   //配置路由  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  console.log("错误：",err.message)
  res.json({
    code: err.status || 500,
    success:"false",
    resultMsg:"接口错误"
  })
  // res.status(err.status || 500);

  // res.render('error');
});

/*--------------------------------------------*/
/*------------socket部分代码--------------*/
//连接数据库
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    path: '/socket'
});

server.listen(3002);
// WARNING: app.listen(80) will NOT work here!


io.on('connection', function(socket) {

  
    io.emit('login', { msg: '一个位用户已登录', content: 1 })


    // to one room
    // socket.to('others').emit('an event', { some: 'data' });

    //监听发送的消息
    socket.on('mes', function(data) {
        if (data.editor) {
            io.emit('update', { msg: 'server发的最新内容', content: data.editor })
        }
    })

    socket.on('disconnect', function() {
        io.emit('user disconnected');
    });
});



/*------------socket部分代码--------------*/
/*--------------------------------------------*/

module.exports = app;
