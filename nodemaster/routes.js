var express=require('express');
var router = express.Router();   //可使用 express.Router 类创建模块化、可挂载的路由句柄

// 引入接口模块

var index = require('./projects/index');

//系统配置
var systems=require('./projects/systems/systems_query');

//用户接口
var login=require('./projects/user/login');  //用户登录
var register=require('./projects/user/register');       //用户注册
var userQuery=require('./projects/user/user_query');  //用户查询、操作
var logout=require('./projects/user/logout');   //用户登出
var user=require('./projects/user/user');  //用户查询、操作
var accountsQuery=require('./projects/accounts/accounts.query');  //用户账号查询
var accounts=require('./projects/accounts/accounts');  //用户账号查询

var blanks=require('./projects/blanks/blanks');  //银行信息查询

//上传接口
var upload=require('./projects/upload/upload');


//数字字典
var dictionary_query=require('./projects/dictionary/dictionary_query');
var dictyList=require('./projects/dictionary/dictyList');

//角色
var role_query=require('./projects/role/role_query');
var role=require('./projects/role/role');

//菜单管理
var menus_query=require('./projects/menus/menus_query');


//权限
var permission=require('./projects/permission/permission');  
var permissions_query=require('./projects/permission/permissions_query'); 


//生产厂家管理
var manufacturer_query=require('./projects/manufacturer/manufacturer_query');
var manufacturer=require('./projects/manufacturer/manufacturer');

//药品管理
var drug_query=require('./projects/drug/drug_query');
var drug_web_query=require('./projects/drug/drug_web_query'); //前台查询

//疾病管理
var disease_query=require('./projects/disease/disease_query');
var disease=require('./projects/disease/disease');

//报告
var report_query=require('./projects/report/report_query');
var report=require('./projects/report/report');

//组织机构
var dept_query=require('./projects/dept/dept_query');
var dept_web=require('./projects/dept/dept');

//通知公告
var articles_query=require('./projects/articles/articles_query');
var articles=require('./projects/articles/articles');





//配置前台路由   // http://localhost:3000/des/querys
router.use('/', index);  
router.use('/login', login);  //
router.use('/register',register); //
router.use('/blanks', blanks);  


router.use('/dictyList',dictyList); 
router.use('/manufacturer',manufacturer); //生产厂家查询
router.use('/drug',drug_web_query); //药品查询
router.use('/dept',dept_web); //药品查询
router.use('/report',report); //报告

router.use('/user',user); //  前端用户查询
router.use('/accounts',accounts); //  前端用户账号查询

router.use('/disease',disease); //疾病管理



//配置后台路由 
router.use('/admin/login',login); //
router.use('/admin/user',userQuery); //  
router.use('/admin/accounts',accountsQuery); // 后端用户账号查询

router.use('/admin/systems',systems); //  

router.use('/admin/dictionary',dictionary_query);
router.use('/admin/role',role_query);


// router.use('/admin/permission',permission_query);

router.use('/admin/manufacturer',manufacturer_query);

router.use('/admin/drug',drug_query);

router.use('/admin/report',report_query);

router.use('/admin/permissionck',permission); //检查权限

router.use('/admin/dept',dept_query); //组织机构

router.use('/admin/rolePermission',permissions_query); //角色权限设置

router.use('/admin/menu',menus_query); //菜单管理

router.use('/admin/articles',articles_query); //通知公告

router.use('/admin/disease',disease_query); //疾病管理







//前后台通用模块

router.use('/upload',upload); 
router.use('/logout',logout);
router.use('/permissionck',permission);  //检查权限
router.use('/role',role);  //获取下拉角色列表
router.use('/articles',articles); //通知公告


module.exports = router;   //暴露这个 router模块
