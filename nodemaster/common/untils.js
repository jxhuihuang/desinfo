
let tokenKey="suiyiers"  //生成token的秘钥
let admin_indexUrl="/admin/dashboard"; //后台主页链接地址
let admin_id=7;
let defalut_password="123456"
let commons={tokenKey, admin_indexUrl, admin_id, defalut_password}
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

// 随机数
function random(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

/**
 * 定义BASE64加解密的类
 * @constructor
 */
function Base64() {
    //安全工程方法
    if(!(this instanceof Base64)){
        return new Base64();;
    }
    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * 定义加密的方法
     * @param  {[type]} input [description]
     * @return {[type]}       [description]
     */
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    /**
     * 定义解密的方法
     * @param  {[type]} input [description]
     * @return {[type]}       [description]
     */
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0,
            c = c2,
            c2 = c3,
            c3 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
/* 判断是否是 ""或undefind null */
function checkNull(obj) {
    var isNull=false;
    if (obj === null || typeof (obj) === "undefined") {
        isNull=true;
    }else{
        var type = (typeof (obj)).toLowerCase();

        if (type === "string" && (obj.toString()).replace(/(^\s*)|(\s*$)/g, "") === "") {
            isNull=true;
        }
    }
    return isNull;
}

/* 去除 undefind、 null 全部设为 ""  */
function removeNull(obj) {
    if (obj === null || typeof (obj) === "undefined") {
        obj="";
    }else{
        var type = (typeof (obj)).toLowerCase();
        if(type === "string" ){
            if( (obj.toString()).replace(/(^\s*)|(\s*$)/g, "") === ""){
                obj="";
            }else{
                obj=obj.replace(/(^\s*)|(\s*$)/g, "")
            }
        }
        
    }
    return obj;
}
function filter(tableKey, obj) {
    var tableKeys=tableKey;
    if(Array.isArray(obj)){
        let argsArry = []
        obj.map(function(argumentsobj){
            let args =filterSinge(tableKeys, argumentsobj);
            argsArry.push(args)
        })
        return argsArry
    }else{
        let args = filterSinge(tableKeys, obj);
        return args;
    }
};
/***单个处理 */
function filterSinge(tableKeys, obj){
    let args = {}
    for(var k in obj) {
        if(Array.isArray(k)){
            args[k]=obj[k]
        }else{
            tableKeys.map((keyobj)=>{
                if(k==keyobj){
                    var valus=obj[k]
                    if(checkNull(valus)){
                        args[k]=removeNull(valus);
                    }else{
                        if((typeof (valus)).toLowerCase()=="string"){
                            if(indexof(valus,"%")){
                                args[k]={[Op.like]:valus}  
                            }else{
                                args[k]=removeNull(valus);
                            }

                        }else{
                            args[k]=valus;
                        }
                    }


                }
            })

        }

    }
    return args;
}
function stringToArry(strings){
    if(checkNull(strings)) return [];
    strings=strings.toString();
    
    if(strings.indexOf(",")==-1) {
        var stringsArry=[]
        stringsArry.push(strings)
        return stringsArry;
    }
    var stringsArry=[]
    strings=strings.lastIndexOf(",")==strings.length-1?strings.substring(0,strings.lastIndexOf(",")):strings;
    for(var i=0; i<strings.split(",").length;i++){
        stringsArry.push(removeNull(strings.split(",")[i]))
    }
    var nerArry=[];
    stringsArry.map(function(obj){
        if(nerArry.indexOf(obj)=="-1"){
            nerArry.push(obj)
        }
    })
    return nerArry
}

/**判断是否包含 */
function indexof(obj, strings){
    var ishas="";
    if(!obj){
        ishas=false;
        return false;
    }
    if(checkNull(strings)){
        ishas=false;
    }else{
        strings=strings.toString()
        var objtype = (typeof (obj)).toLowerCase();
        if(objtype=="number"){
            obj=obj.toString()
        }
        if(obj.indexOf(strings)==-1){
            ishas=false;
        }else{
            ishas=true;
        }
    }
    return ishas;
}
//验证登录缓存状态
function jwtVerify(req, jwt, callBack){
    let currenturl=req.headers.currenturl //前端url
    let param_token=req.headers.tokens; //前端获取的token
    var session_token=req.session.tokens//后端保存的token
    var decode={};
    if(!param_token){
        decode.logonType=false;
        callBack(decode)
    }else{
        jwt.verify(param_token, commons.tokenKey, function (err, decodes) {
            if (err) {  //  时间失效的时候/ 伪造的token 
                decode.logonType=false;
            }else {
                decode=decodes
                decode.logonType=true;
                // if(checkNull(session_token)){
                //     decode.logonType=false;
                // }else{
                //     if(session_token[decodes.username] && session_token[decodes.username]===param_token){
                //         decode=decodes
                //         decode.logonType=true;
                //     }else{
                //         decode.logonType=false;
                //     }
                // }
            }
            callBack(decode)
        })
    }
}
/*****权限列表中获取 相应链接的权限 */
function getUrlPermission(permissionList=[],url=""){
    var permission={name:"",link:"",permission_list:[],role:""}
    if(permissionList.length>0 && url!="" ){
        permissionList.map(function(objs){
            if(objs.link==url){
                permission=objs
            }
        })
    }
    return permission
}
/**
 * permysql  链接数据权限
 * 
 * 
 */
function checklinkPermission(req,  jwt, permysql, _methods, callBack){
    let urls=req.url.indexOf("?")>0?req.url.split("?")[0]:req.url;
    urls=urls.lastIndexOf("/")==urls.length-1?urls.substring(0,urls.lastIndexOf("/")):urls;
    const webType=urls.indexOf("admin")>0?"admin":urls.indexOf("admin")==-1?"web":"";
    let type=_methods;
    jwtVerify(req, jwt,function(decode){
        type=type=="queryUser"?"query":type;
        if(webType=="admin" && !decode.logonType){
            callBack({
                islogin:false,
                permission:false,
                decode:{},
                resultCode:"13",
                resultText:"用户已经过期",
            })
            return false;
        }
        let user_role=decode.roles;
        if(user_role.toString().indexOf(",")!=-1){
            user_role={[Op.or]:stringToArry(user_role)};
        }
        permysql.findAll({
            order:[['createData', 'ASC']],
            attributes:["name",'link', 'permission_list','role'],
            where:{link:urls, role:user_role}
        },(result)=>{
            result=result?JSON.parse(JSON.stringify(result)):"";
            if(result=="" || result.length==0){
                callBack({
                    permission:true,
                    islogin:true,
                    resultCode:"0",
                    resultText:"",
                    permission_list:[]
                }) 
                return false;
            }
            result=mergePermission(result); /***合并权限列表中多个链接中的相同权限 */
            var Permissions=result[0].permission_list; 
            if(!Permissions.includes(type)){
                callBack({
                    permission:false,
                    islogin:true,
                    resultCode:"15",
                    resultText:"用户权限不足",
                }) 
                return false;
            }else{
                callBack({
                    permission:true,
                    islogin:true,
                    resultCode:"0",
                    resultText:"",
                    permission_list:Permissions
                }) 
            }
        })
    })
    


}

/****获取当前网站url */
function getcurrentUrl(currentUrl){
    if(checkNull(currentUrl)){
       return "";
    }
    currentUrl=currentUrl.indexOf("/index.html")?currentUrl.split("/index.html")[0]:currentUrl;
    currentUrl=currentUrl.indexOf("?")>0?currentUrl.split("?")[0]:currentUrl;
    currentUrl=currentUrl.indexOf("#")>0?currentUrl.split("#")[0]:currentUrl;
    currentUrl=currentUrl.lastIndexOf("/")==currentUrl.length-1?currentUrl.substring(0,currentUrl.lastIndexOf("/")):currentUrl;
    return currentUrl;
}

/**
 * permysql  权限数据库
 * 
 *返回 值说明
 *islogin:false,  是否登录
 *permission:false,  是否有权限
 *resultCode:"13",           返回代码 200: 成功  13 ：用户已经过期、   14 ：用户权限不足  15 无登录权限
 *resultText:"用户已经过期",    "错误说明"
 */
function checkPermission(req, res, jwt, permysql, currentUrls, callBack){
    callBack=callBack?callBack:function(){};
    let urls=req.url.indexOf("?")>0?req.url.split("?")[0]:req.url;
    urls=urls.lastIndexOf("/")==urls.length-1?urls.substring(0,urls.lastIndexOf("/")):urls;
    if(urls==""){
        urls=req.baseUrl.indexOf("?")>0?req.baseUrl.split("?")[0]:req.baseUrl;
    }
    let currentUrl=currentUrls?currentUrls:req.headers.currenturl //前端url
    currentUrl=getcurrentUrl(currentUrl)
    let params =JSON.parse(JSON.stringify(req.body));
    const webType=currentUrl.indexOf("admin")>0?"admin":currentUrl.indexOf("admin")==-1?"web":"";
    let type="query";
    if(currentUrl.indexOf("/add")!=-1){
        currentUrl=currentUrl.split("/add")[0]
        type="add"
    }
    if(currentUrl.indexOf("/edit")!=-1){
        currentUrl=currentUrl.split("/edit")[0]
        type="edit"
    }
    if(currentUrl.indexOf("/detail")!=-1){
        currentUrl=currentUrl.split("/detail")[0]
        type="detail"
    }
    if(params._methods=="delete"){
        type="delete"
    }
    jwtVerify(req, jwt,function(decode){
        switch(webType){
            case "admin":
                if(!decode.logonType){
                    callBack({
                        islogin:false,
                        permission:false,
                        decode:{},
                        resultCode:"13",
                        resultText:"用户已经过期",
                    })
                    return false;
                }
                
                let user_role=decode.roles?decode.roles:"";
                if(user_role.toString().indexOf(",")!=-1){
                    user_role={[Op.or]:stringToArry(user_role)};
                }
                var links=currentUrl==admin_indexUrl?currentUrl:{[Op.or]:[currentUrl, admin_indexUrl]}
                permysql.findAll({
                    order:[['createData', 'ASC']],
                    attributes:["name",'link', 'permission_list','role'],
                    where:{link:links, role:user_role}
                },(result)=>{
                    result=result?JSON.parse(JSON.stringify(result)):"";
                    if(result=="" || result.length==0){
                        callBack({
                            permission:false,
                            islogin:false,
                            decode:decode,
                            resultCode:"15",
                            loginpermission:false,
                            resultText:"用户权限不足",
                        }) 
                        return false;
                    }
                    result=mergePermission(result) /***合并权限列表中多个链接中的相同权限 */
                    var login_perobj=false   //后台主页权限集 （主页有权限才有登录权限）
                    var permissionobj=false  //当前页面权限集
                    result.map(function(objs){
                        if(objs.link==admin_indexUrl){   // admin_indexUrl 后台主页链接
                            login_perobj=objs
                        }
                        if(objs.link!=admin_indexUrl){
                            permissionobj=objs
                        }
                    })
                    var loginpermission=false; //是否有登录权限
                    // 设置登录权限  
                    if(!login_perobj.permission_list){
                        loginpermission=false
                    }else{
                        var loginPerobj_list=login_perobj.permission_list;
                        if(loginPerobj_list.indexOf("query")=="-1"){
                            loginpermission=false
                        }else{
                            loginpermission=true;
                        }
                    }
                    //后台主页   直接判断登录权限
                    if(currentUrl==admin_indexUrl){  //当前页即是后台主页 
                        if(!loginpermission){
                            callBack({
                                permission:false,
                                islogin:true,
                                decode:decode,
                                resultCode:"15", 
                                resultText:"用户权限不足",
                            }) 
                            return false;
                        }else{
                            callBack({
                                permission:true,
                                islogin:true,
                                decode:decode,
                                resultCode:"0",
                                resultText:"",
                                permission_list:login_perobj.permission_list
                            }) 
                            return false;
                        }
                    }
                    //非后台主页
                    if(currentUrl!=admin_indexUrl){ 
                        if(!loginpermission){
                            callBack({
                                permission:false,
                                islogin:true,
                                decode:decode,
                                resultCode:"15", 
                                resultText:"用户权限不足",
                            }) 
                            return false;
                        }
                        var nowpermissions=false; //是否有登录权限
                        // 设置当前页权限  
                        if(!permissionobj.permission_list){
                            nowpermissions=false
                        }else{
                            var Perobj_list=permissionobj.permission_list;
                            if(Perobj_list.indexOf("query")=="-1"){
                                nowpermissions=false
                            }else{
                                nowpermissions=true;
                            }
                        }

                        if(!nowpermissions){
                            callBack({
                                permission:false,
                                islogin:true,
                                decode:decode,
                                resultCode:"14", //14
                                resultText:"用户权限不足",
                                permission_list:false
                            }) 
                            return false;
                        }else{
                            callBack({
                                permission:true,
                                islogin:true,
                                decode:decode,
                                resultCode:"0",
                                resultText:"",
                                permission_list:permissionobj.permission_list
                            }) 
                            return false;
                        }
                    }

                },{res})

            break;

            case "web":
               
               
                var logonType=decode.logonType;
                var unit_category=removeNull(decode.unit_category); //单位类别
                var paramsObj={link:currentUrl}
                
                if(decode.logonType){
                    let user_role=decode.roles?decode.roles:"";
                    if(user_role.toString().indexOf(",")!=-1){
                        user_role={[Op.or]:stringToArry(user_role)};
                    }
                    paramsObj.role=user_role;
                }
                permysql.findAll({
                    order:[['createData', 'ASC']],
                    attributes:["name",'link', 'permission_list',"role"],
                    where:paramsObj
                },(result)=>{
                    result=result?JSON.parse(JSON.stringify(result)):"";
                   
                    if(!decode.logonType){
                        if(result=="" || result.length==0){
                            callBack({
                                permission:true,
                                islogin:logonType,
                                decode:decode,
                                resultCode:"0",
                                resultText:"",  
                               
                            }) 
                            return false;
                        }else{
                            callBack({
                                permission:false,
                                islogin:false,
                                decode:{},
                                resultCode:"14", //resultCode:"14",
                                resultText:"用户权限不足",
                            }) 
                            return false;
                        }
                        
                    }

                    

                    if(decode.logonType){
                        if(result=="" || result.length==0){
                            if(currentUrl.indexOf("/drug")!=-1){
                                if(unit_category=="生产企业"){
                                    callBack({
                                        permission:true,
                                        islogin:logonType,
                                        decode:decode,
                                        resultCode:"0",
                                        resultText:"",  
                                    }) 
                                    return false;
                                }else{
                                    callBack({
                                        permission:false,
                                        islogin:logonType,
                                        decode:decode,
                                        resultCode:"14",
                                        resultText:"用户权限不足", 
                                    }) 
                                    return false;
                                }
                            }else{
                                callBack({
                                    permission:true,
                                    islogin:logonType,
                                    decode:decode,
                                    resultCode:"0",
                                    resultText:"",  
                                }) 
                                return false;
                            }
    
                        }else{
                            result=mergePermission(result) /***合并权限列表中多个链接中的相同权限 */
                            var permission_list=result[0].permission_list;
                            if(permission_list.indexOf(type)==-1){
                                callBack({
                                    permission:false,
                                    islogin:true,
                                    decode:decode,
                                    resultCode:"14",
                                    resultText:"用户权限不足", 
                                }) 
                                return false;
                            }

                            if(currentUrl.indexOf("/drug")!=-1){
                                if(unit_category=="生产企业"){
                                    callBack({
                                        permission:true,
                                        islogin:true,
                                        decode:decode,
                                        resultCode:"0",
                                        resultText:"", 
                                        permission_list:permission_list 
                                    }) 
                                    return false;

                                }else{
                                    callBack({
                                        permission:false,
                                        islogin:true,
                                        decode:decode,
                                        resultCode:"14",
                                        resultText:"用户权限不足", 
                                    }) 
                                    return false;
                                }
                            }else{
                                callBack({
                                    permission:true,
                                    islogin:true,
                                    decode:decode,
                                    resultCode:"0",
                                    resultText:"",  
                                    permission_list:permission_list 
                                }) 
                                return false;
                            }
                        }
                    }
                },{res})
            break;
        }
    })
}

function checkLoginPermission(req, res, jwt, permsql, role, callBack){
    let currentUrl="/admin/dashboard";
    if(role.toString().indexOf(",")!=-1){
        role={[Op.or]:stringToArry(role)};
    }
    permsql.findAll({
        order:[['createData', 'ASC']],
        attributes:["name",'link', 'permission_list','role'],
        where:{link:currentUrl, role:role}
    },(result)=>{
        result=result?JSON.parse(JSON.stringify(result)):"";
        if(result=="" || result.length==0){
            callBack({
                permission:false,
                islogin:false,
                decode:decode,
                resultCode:"15",
                loginpermission:false,
                resultText:"用户权限不足",
            }) 
            return false;
        }
        result=mergePermission(result) /***合并权限列表中多个链接中的相同权限 */

        if(!result[0] || !result[0].permission_list){
            callBack({
                permission:false,
                resultCode:"15",
                resultText:"用户权限不足",
            }) 
            return false;
        }else{
            var loginPermission=result[0].permission_list;
            if(loginPermission.indexOf("query")=="-1"){
                callBack({
                    permission:false,
                    resultCode:"15",
                    resultText:"用户权限不足",
                }) 
                return false;
            }else{
                callBack({
                    permission:true,
                    islogin:true,
                    resultCode:"0",
                    resultText:"",
                    permission_list:loginPermission
                }) 
                return false;
            }
        }
    },{res})


}

/***合并权限列表中多个链接中的相同权限 */
function mergePermission(result){
    var permissionArry=[]
    var roleArry=[];
    result.map(function(objs){
        objs.permission_list=stringToArry(objs.permission_list);//把权限字符串转化成数组
        objs.role=stringToArry(objs.role);//把权限字符串转化成数组
        var link=objs.link;
        var ishas=false;
        permissionArry.map(function(perObj){
            if(perObj.link==link){
                ishas=true;
                var permission=perObj.permission_list;
                var role=perObj.role;
                if(objs.permission_list.length>0){
                    objs.permission_list.map(function(pobj){
                        if(!permission.includes(pobj)){
                            perObj.permission_list.push(pobj)
                        }
                    })
                }
                objs.role.map(function(roleobj){
                    if(!role.includes(roleobj)){
                        perObj.role.push(roleobj);
                    }
                })
                perObj.role=perObj.role.length>0?perObj.role.join(","):""
            }
        })
        
        !ishas?permissionArry.push(objs):"";
    })
    return permissionArry
}
/*****传值处理  前台传值 如果值过多的话会变成对象 */
function dealparams(params){
    if(Array.isArray(params)){
        return params
    }else{
        var type = (typeof (params)).toLowerCase();
        if(type=="object"){
            var newparams=[];
            for(var k in params ){
                if(!isNaN(k)){
                    newparams.push(params[k])
                }
            }
            return newparams
        }else{
            return params
        }
   }
}
/* -----------------  标准时间转换成yyyy-MM-dd ----------------- */
var formatDateTime = function (date, format) { 
    format=format?format:"YYYY-MM-DD"
    date=checkNull(date)?new Date():new Date(date);
    var y = date.getFullYear(); 
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes();  
    minute = minute < 10 ? ('0' + minute) : minute;  
    if(format=="YYYY-MM-DD"){
        return y + '-' + m + '-' + d
    }
    if(format=="YYYYMMDD"){
       
        return y + m + d; 
    }
    if(format=="YYYY-MM-DD H:m"){
        return y + '-' + m + '-' + d+' '+h+':'+minute; 
    }
    
};  
//获取时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate.toString();
}
module.exports = {
    commons: commons,
    random:random,
    Base64:Base64,
    filter:filter,
    stringToArry:stringToArry,
    checkNull:checkNull,
    removeNull:removeNull,
    jwtVerify:jwtVerify,
    getcurrentUrl:getcurrentUrl,
    checkPermission:checkPermission,
    checkLoginPermission:checkLoginPermission,
    checklinkPermission:checklinkPermission,
    mergePermission:mergePermission,
    indexof:indexof,
    dealparams:dealparams,
    formatDateTime:formatDateTime,
    getNowFormatDate:getNowFormatDate,
}