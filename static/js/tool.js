var currentUrl=window.location.href;

// var ipDress=currentUrl.lastIndexOf(":")>0?currentUrl.substr(0,currentUrl.lastIndexOf(":")):currentUrl;
var ipDressurl=currentUrl;
var ipDressurl_top="";
var now_permission=false;
var admin_id=7; //超级用户id
var register_rorle_id=3; //注册时默认角色id
var body_widths=isMobile?window.innerWidth:window.screen.availWidth ;
var body_heights=isMobile?window.innerHeight:window.screen.availHeight;
var ismobiles=body_widths<768 || isMobile?true:false;

if(ipDressurl.indexOf("//")>=0){
    ipDressurl_top=ipDressurl.split("//")[0]+"//"
    ipDressurl=ipDressurl.substr(ipDressurl.indexOf("//")+2, ipDressurl.length-1)
} 
if(ipDressurl.indexOf("/")>=0){
    ipDressurl=ipDressurl.substr(0,ipDressurl.indexOf("/"));
}
var ipDress=ipDressurl_top+ipDressurl;
var default_avatar="/uploads"+"/default.png";
var default_group="/uploads"+"/group.png";
var img_ipDress=ipDress
/****跳转 */
function linkTo(url){
  var referrerurl = document.referrer? document.referrer:"";  //获取的上一页
  if(!url){
    window.location.href=referrerurl;
  }else{
    window.location.href=url;
  }
  
}

/***判断是否是手机 */
function ismobile(){
    var ismobile=false;
    var isshow=$("#ismobile").is(':hidden')
    if(isshow){
        ismobile=true;
    }
    if(!isshow){
        ismobile=false;
    }
    return ismobile;
}



//判断移动端还是电脑端
var isMobile = (function () {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return true //手机端";
    }
    else {
        return false//pc端
    }
})();

/* 银行卡验证 */
function bankcheck(values,callBack){
    callBack=callBack?callBack:function(){};
    // var e=window.event||event; //消除浏览器差异
    // var values=e.target.value;
    if (values == "") return;
    var account = new String (values);
    account = account.substring(0,22); /*帐号的总数, 包括空格在内 */
    if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
        /* 对照格式 */
        if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
            var accountNumeric = accountChar = "", i;
            for (i=0;i<account.length;i++){
                accountChar = account.substr (i,1);
                if (!isNaN (accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for (i=0;i<accountNumeric.length;i++){ /* 可将以下空格改为-,效果也不错 */
                if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
                if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
                if (i == 12) account = account + " ";/* 帐号第十二位后数后加空格 */
                account = account + accountNumeric.substr (i,1)
            }
        }
    }else{
        account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
    }
    if (account != values){
        callBack(account)
    } 
    // if (account != values) e.target.value= account;
}

/** 禁止非数字输入 */
function checkNaN(event,params){
    var e=window.event||event; //消除浏览器差异
    var code = e.keyCode||e.which;  //8 为backsppace键 
    var values=e.target.value;
    var defaultParams = {
        type:"1",
        isalert:false,
        tle:"",
        ischeckNull:false,
        callback:function(){},
        success:function(){},
    }
    var settings = {};
    jQuery.extend(settings,defaultParams,params);
    var type=settings.type;
    var isalert=settings.isalert;
    var tle=settings.tle;
    var ischeckNull=settings.ischeckNull;
    var callback=settings.callback;
    var success=settings.success
    
    var alertText=tle==""?(type=="2"?"只能输入正数字":"只能输入数字"):tle; //提示的文字
    if(!e.target.value || e.target.value==""){
        ischeckNull?success(event):"";
        // e.target.value=""
    }else{
        var reg=/^([1-9]\d*|[0]{1,1})$/  //isNaN()
        checkKey=type=="2"?!reg.exec(e.target.value):isNaN(e.target.value)
        if(code!=8 && checkKey){  
            e.target.value=(values.substring(0,(values.length-1))).replace(/[^\d.]/g,'');
            isalert?layer.msg(alertText,{icon:5}):"";
            callback(alertText);
            e.returnValue = false; 
        }else{
            success(event);
        }
    }
}

/*****对象 转组*/
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

//返回上一页
function toback(){
    var referrerurl = document.referrer? document.referrer:"";  //获取的上一页
    var currenturl = window.location.href;  //获取当前url
    var tobackUrl =sessionStorage.getItem("tobackUrl"); //缓存中的上一页
    tobackUrl=tobackUrl?JSON.parse(tobackUrl):{};
    var prevUrl=tobackUrl.prevUrl?tobackUrl.prevUrl:"";
    var topUrl=tobackUrl.topUrl?tobackUrl.topUrl:"";
    if(referrerurl==""){
        if(tobackUrl.prevUrl!=""){
            tobackUrl.prevUrl=currenturl;
            tobackUrl.topUrl=prevUrl;
            setTimeout(function () {
                window.location.href=tobackUrl.prevUrl;
            }, 320)
        }
    }else{
        if(referrerurl!=currenturl){
            setTimeout(function () {
                window.location.href=referrerurl;
            }, 320)
        }
       
    }
}
/*检查是否是 ""或undefind null  、返回TRUE 则为空， false 则为非空     */
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

//获取url参数
function geturl(name) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(location.href)) return decodeURI(RegExp.$2.replace(/\+/g, " ")); return "";
};



//提交报告页面 快速跳转 （调试用）
function fastTo(){
    var currturl = window.location.href;  //获取当前url
    var pages=geturl("page")==""?1:geturl("page")
    var length=$(".input-list .page").length;
    if(pages<=length){
        $(".input-list .page").eq(pages-1).addClass("active").attr("style","").siblings(".input-list .page").removeClass("active").attr("style","display:none");
    }
}

//生成时间戳
function Timestamp() {
    var a = Math.random, b = parseInt;  
    return Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a()); 
}



/* -----------------  标准时间转换成yyyy-MM-dd ----------------- */
var formatDateTime = function (date) { 
    date=checkNull(date)?new Date():new Date(date);
    var y = date.getFullYear(); 
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes(); 
    var seconds= date.getSeconds(); 
    minute = minute < 10 ? ('0' + minute) : minute; 
    seconds= seconds < 10 ? ('0' + seconds) : seconds;
    return y + '-' + m + '-' + d+' '+h+':'+minute+":"+seconds;  
};  
//生成随机数
/*
type:1 时生成数字 2字母  其他值为数字加字母
*/

function generateMixed(n, type) {
    type=checkNull(type)?3:type;
    var chars = [];
    var num = 0;
    chars=type==1?
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']// 数字
    :
        type==2?
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        :
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']    
            //数字加字母  
    num = chars.length-1;
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * num);
        res += chars[id];
    }
    return res;
}
/* ----------------- 通用ajax ----------------- */
    /**
     *  ajaxUrl：     ajax的URl
     *  returnData：  ajajx传送的参数
     *  types：       ajajx 类型 默认为post
     *  async：       使用同步的方式, true：为异步方式 false：同步  默认true
     *  isparse：     是否使用 JSON.parse(JSON.stringify())转换 true:使用, false:不使用 默认true
     *  dataType      数据类型 默认json
     *  contentType:  发送信息至服务器时内容编码类型   application/x-www-form-urlencoded 、application/json，默认 application/x-www-form-urlencoded 
     *  showload:     是否显示正在加载图片 默认false
     *  closeLoad:    是否在ajax成功或失败后关闭加载图片 默认true
     *  loadbox:      正在加载在哪个div显示  为空时直接弹出
     *  loadtime:     加载延迟时间 默认320秒
     *  currentPages：当前页数 默认1
     *  disabelBox：  点击后禁用的按钮
     *  success：     成功后的回调函数
     *  erro：        失败后的回调函数
     */
    function ajaxFns(returnData,success,ajaxUrl,params){
        var defaultParams = {
            // returnData:{},
            types:"post",
            async:true,
            isparse:true,
            dataType:"json",
            contentType:"application/x-www-form-urlencoded",
            showload:false, 
            closeLoad:true,
            loadbox:"", 
            loadtime:320, 
            currentPages:1,
            disabledBox:"",
            cache:true,
            processData:true,
            erro:function(){},
            beforeSend:function(){},
        }
        var settings = {};
        $.extend(settings,defaultParams,params);
        
        // var returnData=settings.returnData;
        var types=settings.types;
        var async=settings.async;
        var isparse=settings.isparse;
        var dataType=settings.dataType;
        var contentType=settings.contentType;
        var showload=settings.showload;
        var closeLoad=settings.closeLoad;
        var loadbox=settings.loadbox;
        var loadtime=settings.loadtime;
        var currentPages=settings.currentPages;
        var disabledBox=settings.disabledBox;
        var cache=settings.cache;
        var processData=settings.processData;
        var erro=settings.erro;
        var beforeSend=settings.beforeSend;
        success=success?success:function(){};
        var ajaxurls=!checkNull(ajaxUrl)?ajaxUrl.indexOf("?")>=0?ajaxUrl+"&v1="+Timestamp():ajaxUrl+"?v1="+Timestamp():""; //ajax url
        var isload="true";; //是否正在加载数据
        var returnDatas=isparse?JSON.parse(JSON.stringify(returnData)):returnData;
            /* 显示正在加载 图标 */
            if(showload){
            setTimeout(function(){
                    if(isload=="true"){
                        if(loadbox==""){
                            layer.load(0, {
                            shadeClose: false,
                            shade: [0.1,"#333"] //0.1透明度的白色背景
                            }); //0代表加载的风格，支持0-2
                        }else{
                            $(loadbox).html('<span class="loadbox"><p class="layui-layer-content layui-layer-loading0"><i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop">&#xe63d;</i></p></span>')
                        }
                    }
                },loadtime)
            }
            disabledBox!=""?$(disabledBox).attr("disabled",true):"";  //禁用点击的按钮
            $.ajax({
                url: ajaxurls,
                data: returnDatas,
                type: types,
                async: async,
                // dataType: dataType,
                contentType:contentType, 
                cache:cache,
                processData:processData,
                success: function (data) {
                    isload="false"; 
                    showload && closeLoad?layer.closeAll('loading'):"";
                    disabledBox!=""?$(disabledBox).attr("disabled",false):"";
                    var resultMsg=data.resultMsg;
                    var webTypes=currentUrl.indexOf("admin")!=-1?"admin":"web"; //判断是前端还是后台
                    if(data.success==="false"){
                      var resultCode=data.resultCode;
                        switch(resultCode){
                            case "10":
                            case "11":
                                layer.msg("用户名密码错误",{icon:2})
                            break;
                            case "12":
                                layer.msg("用户还在审核中",{icon:2})
                            break;
                            case "13":
                                if(webTypes=="web"){
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("userInfo")
                                }    
                                if(webTypes=="admin"){
                                    if(!localStorage.getItem("token")){
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("userInfo")
                                        window.location.href="/admin/auth/login/index.html"
                                    }else{
                                        layer.msg("用户已经过期",{time: 1000, icon:2},function(){
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("userInfo")
                                            window.location.href="/admin/auth/login/index.html"
                                        })
                                    }
                                }  
                            break;
                            case "14":
                            case "15":
                                if(webTypes=="admin"){
                                    notpermission_a(".page-main");
                                }else{
                                    notpermission("main[role=main]");
                                }
                            break;
                            case "16":
                                layer.msg(resultMsg,{icon:2})
                            break;
                            default:
                                layer.msg(resultMsg?resultMsg:"接口异常",{icon:2})
                            break;
                        }
                    success(data);
                    }else{
                        success(data);
                    }
                },
                beforeSend: function(xhr) {
                    //将cookie中的token信息放于请求头中
                    // request.setRequestHeader("authStr", $.cookie('authStr'));
                    var tokens=localStorage.getItem("token");
                    if(tokens && tokens!=""){
                        xhr.setRequestHeader("tokens", tokens);
                    }

                    var currentUrl=getCurrentUrl()?getCurrentUrl():"index";
                    xhr.setRequestHeader("currentUrl", currentUrl);
                    beforeSend(xhr)
                },
                erro: function (XMLHttpRequest, textStatus, errorThrown) {
                    showload && closeLoad?layer.closeAll('loading'):"";   
                    disabledBox!=""?$(disabledBox).attr("disabled",false):"";
                    isload="false"; 
                    erro();
                },
                complete: function (XMLHttpRequest, textStatus){
                   
                    switch (textStatus) {
                        case "error":
                        case "timeout":
                        
                            showload && closeLoad?layer.closeAll('loading'):"";
                            erro();
                        break;
                   }

                }
            });
    }



/************************** 页面函数 *************************/


/* 手机端顶部导航收缩*/
function navbarToggler(){
    var isShow=!$(".navbar-collapse").hasClass("shows");
    var width=document.body.clientWidth;
    var document_height=window.screen.availHeight;
    $(".navbar-collapse").removeClass("addAnimation")
    $(".navbar-collapse").removeClass("removeAnimation")
    if(width<=768){
        if(isShow){
            var navbarSpanHt=$(".navbar-span").get(0).offsetHeight;
            $(".navbar-collapse").css({display:"block",height:"calc(100vh - "+navbarSpanHt+"px)",top:navbarSpanHt+"px"});
            $(".navbar-collapse").addClass("shows addAnimation")
            layer.msg('12',{scrollbar:false,time:0,shadeClose:true,skin:"navbarlay"});
        }
        else{
            $(".navbar-collapse").removeClass("shows")
            $(".navbar-collapse").addClass("removeAnimation")
            layer.closeAll();
        }
    }
}

/******表格 */
function initDataTables(table, data, custom_params) {
    var isString=false;
    var datas=[];
    if(typeof(data)==="string"){
        isString=true;
        datas=[];
    }else{
        isString=false;
        var isArry=Array.isArray(data);
        datas=isArry?data:[]
    }
    var default_params = {
        "responsive": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": false,
        "data":datas,
        "searching":false,
        // "sPaginationType": "full_numbers",
        "aaSorting": [],    // 初始化不排序
        "ordering": false,
        "searching" : false,
        "destroy":true,
        "paging": false, // 禁止分页
        // "oLanguage" :false,
        "bInfo": false, 
        // "serverSide":true,
        "oLanguage": {
        //     "sLengthMenu": "每页显示 _MENU_ 条记录",
        //     "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据", //"没有数据"
        //     "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "sZeroRecords": isString?data:"没有检索到数据",
            "sProcessing": "正在加载数据...",
        //     // "sSearch": "搜索：",
        //     "oPaginate": {
        //         "sFirst": "首页",
        //         "sPrevious": "前一页",
        //         "sNext": "后一页",
        //         "sLast": "尾页"
        //     }
        },
    };
    var params = $.extend(true, {}, default_params, custom_params);
    var dt = table.DataTable(params);
    return dt;
}


function initDataTablesControls(card) {
    $(".card-header", card).append($('.dataTables_length'));
    $(".card-header", card).append($('.dataTables_filter'));
    $('.dataTables_length', card).addClass("form-inline");
    $('.dataTables_filter', card).addClass("ml-auto form-inline");

    $(".card-footer .d-flex", card).append($(".dataTables_info"));
    $(".card-footer .d-flex", card).append($(".dataTables_paginate"));
    $(".dataTables_paginate", card).addClass("ml-auto");
}



/********* 表单序列化 *********/

function serializeArray(formID){
    var fields=$(formID).serializeArray();
    var datas={};
    fields.map(function(obj){
        var key=obj.name;
        var value=obj.value;
        if(datas[key]){
            datas[key]=datas[key]+","+value;
        }else{
            datas[key]=value;
        }
    })
    $(formID).find("input[type=checkbox]").each(function(result){
        var name=$(this).attr("name");
        var  type=$(this).attr("data-type");
        if(name && name!=""){
            var checked=$(this).prop("checked");
            var  checkedValue=$(this).val();
            if(type=="multiple"){
                if(checked){
                    datas[name]=Array.isArray(datas[name])?datas[name]:[]
                    datas[name].push(checkedValue)
                }
            }else{
                if(checked){
                    datas[name]="1"
                }else{
                    datas[name]="0"
                }
            }
        }
    })
    for(var i in datas){
        var values=datas[i];
        if(Array.isArray(values)){
            if(values.length==0){
                datas[i]="";
            }
            if(values.length>0){
                datas[i]=values.join(",")
            }
        }
    }
    return  datas
}
/***获取表单数据 */
function getFormDatas(id, callBack){
    callBack=callBack?callBack:function(){}
    var idType=(typeof (id)).toLowerCase();
    var elem=idType=="string"?$(id):idType=="object"?id:$(id)
    var FormData={}
    elem.find(":input:visible:not(:button)").each(function(){
        var $this=$(this)
        if($this.is("input")){ 
            var type=removeNull($this.attr("type"));
            switch (type){
                case "date":
                    var name=checkNull($this.attr("name"))?$this.prev().attr('name'):$this.attr("name");
                    if(!checkNull(name)){
                        var values=removeNull($this.val());
                        values=Array.isArray(values)?values.join(","):values
                        FormData[name]=values
                    }
                break;
                case "checkbox":
                    var name=checkNull($this.attr("name"))
                    
                    if(!checkNull(name)){
                        var checkvalues=$this.attr("checked");
                        FormData[name]=checkvalues
                    }
                break;

                case "file":
                break;
                default:
                    if(isMobile){
                        var name=removeNull($(this).attr('name'));
                        if(!checkNull(name)){
                            value = removeNull($(this).val());
                            value=Array.isArray(value)?value.join(","):value
                            FormData[name]=value
                        }
                    }else{
                        var id = $(this).attr('id');
                        var name="";
                        if (id.match("-selectized")) {
                            id = id.substring(0, id.indexOf( "-selectized"));
                            name=removeNull($(this).closest(".selectize-control").prev().attr("name"))
                            value = removeNull($("#" + id).val());
                        }else{
                            name=removeNull($(this).attr('name'));
                            value = removeNull($(this).val());
                        }
                        
                        if(!checkNull(name)){
                            value=Array.isArray(value)?value.join(","):value
                            FormData[name]=value
                        }  
                    }
                break;
            }
        }
        if($this.is("textarea")){
            var name=$this.attr("name");
            var values=removeNull($(this).val());
            FormData[name]=values
        }
        if($this.is("select")){
            var name=$this.attr("name");
            var values=removeNull($(this).val());
            values=Array.isArray(values)?values.join(","):values
            FormData[name]=values
        }
    })
    callBack(FormData)
}
/***** 表单赋值 *******/
function formSetValue(id,obj){
    var idType=(typeof (id)).toLowerCase();
    var elem=idType=="string"?$(id):idType=="object"?id:$(id)
    obj=obj?obj:{};
    elem.find(":input").each(function(result){
        var $this=$(this);
        var name=$this.attr("name");
       
        if(!checkNull(name) && !checkNull(obj[name])){
            
            var values=removeNull(obj[name]);
            if($this.is("input")){ 
                var type=removeNull($(this).attr("type"));
                //输入框
                switch (type){
                    case "input":
                        $(this).val(values)
                    break;
                    case "checkbox":
                        if(values=="1" || values=="y"){
                            $(this).attr("checked",true);
                        }else{
                            $(this).attr("checked",false);
                        }
                    break;
                    case "file":
    
                    break;
                    default:
                        $(this).val(values)
                    break;
                }

            }else if($this.is("select")){
                // 下拉框

                
                // if($this.next().hasClass("selectize-control")){
                //      $this.selectSetVal(values)
                // }else{
                //     $(this).val(values)
                // }
                
                
            }else if($this.is("textarea")){
                $(this).val(values)
            }else{
                $(this).val(values)
            }

            
            
        }
    })
}



/*****确认弹框 */
function layerConfirm(text, callBack, params){
    text=text?text:"是否确认"
    callBack=callBack?callBack:function(){};
    var defaultParams = {
        icon: 3,
        title:false,
        closeBtn:false,
        autoClose:false,
    }
    var settings = {};
    $.extend(settings,defaultParams,params);
    
    var icon=settings.icon;
    var title=settings.title;
    var closeBtn=settings.closeBtn;
    var autoClose=settings.autoClose;
    
    layer.confirm(text, {icon: icon, title:title,closeBtn:closeBtn}, function(index){
        autoClose?layer.close(index):"";
        callBack(index)
    });

}

//选择国家
function selectCountry(){
    var body_widths=isMobile?window.innerWidth:document.body.clientWidth;
    var body_heights=isMobile?window.innerHeight:window.screen.availHeight;
    var ismobiles=body_widths>=768 || !isMobile?false:true;
    var heights=ismobiles?body_heights:body_heights*0.8;
    layer.open({
        type: 2,
        title: "选择国家",
        area: [ismobiles?body_widths+"px":"800px", "calc(100vh)"],
        fixed: true,  // 固定
        scrollbar: false,
        maxmin: true,
        anim:ismobiles?2:0,
        closeBtn:ismobiles?2:1,
        offset: ismobiles?'0':'auto',
        content: ['/report/iframe/country', 'yes'],
        success: function (layero, index) {
            $("#layui-layer-content iframe").css("height","calc(100vh)")
            // layer.iframeAuto(index);
            var iframe = window['layui-layer-iframe' + index];
            // 调用子页面的全局函数
            // iframe.setFormTarget('adr_description');
        },
        end: function () {
            
        }
    });
    $(".layui-layer-iframe").css('overflow-y', ismobiles?"scroll":'unset');

}

/****字符串转数组 */
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
        if(!checkNull(strings.split(",")[i])){
            stringsArry.push(removeNull(strings.split(",")[i]))
        }
    }
    var nerArry=[];
    stringsArry.map(function(obj){
        if(nerArry.indexOf(obj)=="-1"){
            nerArry.push(obj)
        }
    })
    return nerArry
}

/**显示template模板 */
function showtemp(data,listTmpl, id, callback){
    var datas=data?data:[];
    var callback=callback?callback:function(){};
    if(datas.length==0){
        $(id).html("没有检索到数据");
    }else{
        var newData={list:datas}
      
        var templates=template(listTmpl, newData);
        $(id).html(templates)
    }
}


function getCurrentUrl(){
    var url=currentUrl.replace(ipDress,"");
    if(url.indexOf("?")>0){
        url=url.split("?")[0]
    }
    if(url.lastIndexOf("/")==url.length-1){
        url=url.substring(0,url.lastIndexOf("/"))
    }
    return url
}

function notpermission(id,text){
    text=checkNull(text)?"您没有权限访问此页面&hellip;":text
    $(id).html(
        '<div  class="containers">'+
            '<div class="jumbotron">'+
                '<h1 class="display-4">403</h1>'+
                '<p class="lead">抱歉，您找到了一个错误页面！</p>'+
                '<hr class="my-4">'+
                '<p>'+text+'&hellip;</p>'+
                '<a class="btn btn-primary btn-lg mt20 mt30" href="javascript:void(0)" onclick="linkTo()" role="button">返回</a>'+
            '</div>'+
        '</div>'
    )
}
function notpermission_a(id,text){
    text=checkNull(text)?"您没有权限访问此页面&hellip;":text
    $(id).html(
        '<div class="page-content">'+
            '<div class="container text-center">'+
                '<div class="display-1 text-muted mb-5"><i class="si si-exclamation"></i> 403</div>'+
                '<h1 class="h2 mb-3">抱歉，您找到了一个错误页面！</h1>'+
                '<p class="h4 text-muted font-weight-normal mb-7">'+text+'&hellip;</p>'+
                '<a class="btn btn-primary" href="/admin/">'+
                    '<i class="fe fe-arrow-left mr-2"></i>返回'+
                '</a>'+
            '</div>'+
        '</div>'
    )
}

/***合并权限列表中多个链接中的相同权限 */
function mergePermission(result){
    var permissionArry=[]
    result.map(function(objs){
        objs.permission_list=stringToArry(objs.permission_list);//把权限字符串转化成数组
        var link=objs.link;
        var ishas=false;
        permissionArry.map(function(perObj){
            if(perObj.link==link){
                ishas=true;
                var permission=perObj.permission_list;
                if(objs.permission_list.length>0){
                    objs.permission_list.map(function(pobj){
                        if(!permission.includes(pobj)){
                            perObj.permission_list.push(pobj)
                        }
                    })
                }
            }
        })
        !ishas?permissionArry.push(objs):"";
    })
    return permissionArry
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

/*** 获取权限及导航数据** */
function getpermissionData(navColumns, callBack){
    var currentUrls=currentUrl
    var webType=currentUrls.indexOf("admin")>0?"admin":currentUrls.indexOf("admin")==-1?"web":"";
    var url=webType=="admin"?ipDress+"/des/admin/permissionck":ipDress+"/des/permissionck"
    ajaxFns({category:webType=="admin"?"admin":"portal", navColumns:navColumns},function(res){
        callBack(res)
        if(webType=="web"){
            switch(res.permissionErro){
                case '13':
                    layer.msg("用户已经过期",{time: 1000, icon:2},function(){
                        localStorage.removeItem("token");
                        localStorage.removeItem("userInfo")
                    })
                break;
                case "14":
                case "15":
                    notpermission("main[role=main]");
                break;
            }
        }

        if(webType=="admin"){
            switch(res.permissionErro){
                case "14":
                case "15":
                    notpermission_a(".page-main");
                break;
                
            }
        }
    },url)
}
/***设置表格操作栏，根据权限判断是否显示 */
function setTablepers(columns, prmissionsArry, prmission){
    columns.map(function(obj,i){
        if(i==columns.length-1){
            obj.title=indexof(prmissionsArry,"add")?obj.title:"";
            // hide_td
            var Arry=[];
            prmission=stringToArry(prmission)
            prmission.map(function(objs){
                objs=removeNull(objs)

                if(indexof(prmissionsArry,objs)){
                    Arry.push(objs);
                }
            })
            obj.className=Arry.length>0?obj.className:obj.className+" hide_td"
           

        }

    })

  return columns
}

/*  截取字符串，多出的显示省略号   */
var cutstr = function (strings, len) {  
    if(checkNull(strings)){
        return removeNull(strings);  
    }

    var restr = strings;  
    var wlength = strings.replace(/[^\x00-\xff]/g, "**").length;  
    if (wlength > len) {  
        for (var k = len / 2; k < strings.length; k++) {  
            if (strings.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {  
                restr = strings.substr(0, k) + "...";  
                break;  
            }  
        }  
    }  
    return restr;  
}



function selectedShow(data,callBack) {
    callBack=callBack?callBack:function(){};
    // var data = {
    //     select: {
    //         field: field,
    //         wrap: wrap,
    //         wrap_class_selected: wrap_class_selected,
    //         wrap_class_original: wrap_class_original
    //     },
    //     others: [
    //         {
    //             key: [key],
    //             items: [
    //                 {
    //                     field: field,
    //                     label: label,
    //                     wrap: wrap
    //                 }
    //             ]
    //         }
    //     ]
    // };
 
    if (!$.isArray(data.others)) {data.others = [data.others];}
   
    var match = false;
    // var $this=data.select.field;
    // var placeholders=$this.attr("placeholder")

    $.each(data.others, function (index, other) {
        var key = other.key;
        if (!$.isArray(key)) {key = [key];}

        var select_data = data.select.field.val()?data.select.field.val():data.select.field.html();
        
        if (!$.isArray(select_data)) {select_data = [select_data]}
        var flag = ($(select_data).filter(key).length == 0);

        if (!$.isArray(other.items)) {other.items = [other.items];}

        $.each(other.items, function (index, item) {
            var itemField=item.field;
            // item.field.prop("hidden", flag);
            // var item_label = item.label || $("label[for='" + item.field.attr("id") + "']");
            // item_label.prop("hidden", flag);
            // closest
            // if($(itemField).parents(".form-group")){
            //     $(itemField).parents(".form-group").attr("hidden", flag)
            // }
            if (item.wrap) {
                item.wrap.prop("hidden", flag);
            }else{
                item.field.prop("hidden", flag);
                
            }
            if (!flag && data.select.wrap) {match = true;}

            callBack();
        });
    });

    if (match && data.select.wrap_class_selected) {
        data.select.wrap.attr("class", data.select.wrap_class_selected);
        callBack();
    } else if (!match && data.select.wrap_class_original) {
        callBack();
    }
}

/***获取单独类型的数字字典 */
function getdict(arry,val,key){
    key=key?key:"prentCode"
    var newdatas=[];
    arry.map(function(obj){
        if(obj[key]==val){
            newdatas.push(obj)
        }
    })
    return newdatas
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
/* 比较日期 */
/**
 * day 比较的日期
 * compareDay ： 被比较的日期  默认为当天
 * 返回三个结果  after：大于当前日期 (当天之后)； today  等于当前日期(当天)；before：小于等于当前日期(当天之前)
 */
var compareDay=function(day,compareDay){
    var currentDay=formatDateTime(new Date(), 'YYYY-MM-DD');
   
    var currdatetime=checkNull(compareDay)?currentDay:compareDay;
    var isbefore="";
    if (Date.parse(currdatetime) < Date.parse(day)) { //大于当前日期
        isbefore="after";
    }
    if (Date.parse(currdatetime) == Date.parse(day)) { //等于当前日期
        isbefore="today";
    }
    //小于等于当前日期
    if (Date.parse(currdatetime) > Date.parse(day)) {
        isbefore="before";
    }
    return isbefore;
}
//初始化时间选择器
function initDatetimePicker(input, custom_params) {
    custom_params=custom_params?custom_params:{};
    var $this=input
    var elem_id=$this.attr("id")?"#"+$this.attr("id"):"."+$this.attr("class");
    var types=$this.attr("data-type")?$this.attr("data-type"):"data";
    var value=removeNull($this.val());

    var default_params = {
        locale: "zh",
        enableTime:types=="datetime"?true:false, //是否启用时间选择
        dateFormat:types=="datetime"?"Y-m-d H:i":"Y-m-d",
        id:"datad",
        allowInput:false,
        maxDate:null,
        minDate:null,
        defaultDate:null, 
        time_24hr:types=="datetime"?true:false, //是否以24小时格式来显示时间。
    };
    //最大值
    if(checkNull(custom_params.maxDate)){
        custom_params.maxDate=null
    }else{
        var maxDate=custom_params.maxDate; 
        if((typeof (maxDate)).toLowerCase()=="string"){ //时间格式
            custom_params.maxDate=maxDate   //+ 24 * 60 * 60 * 1000
        }else if(new Date(maxDate)=="Invalid Date"){ //非时间格式
            if(maxDate.val()){
                custom_params.maxDate=maxDate.val()   
            }

        }else{ //时间格式
            custom_params.maxDate=maxDate   //+ 24 * 60 * 60 * 1000
        }
        if(compareDay(value,custom_params.maxDate)=="after"){
            $this.val("")
        }
    }
    //最小值
    if(checkNull(custom_params.minDate)){
        custom_params.minDate=null
    }else{
        var minDate=custom_params.minDate;
        if((typeof (minDate)).toLowerCase()=="string"){ //时间格式
            custom_params.minDate=minDate    //+ 24 * 60 * 60 * 1000
        }else if(new Date(minDate)=="Invalid Date"){ //非时间格式
            if(minDate.val()){
                custom_params.minDate=minDate.val()  //+ 24 * 60 * 60 * 1000
            }
        }else{//时间格式
            custom_params.minDate=minDate    //+ 24 * 60 * 60 * 1000
        }
        if(compareDay(value,custom_params.maxDate)=="before"){
            $this.val("")
        }
    }
    var params = $.extend(true, {}, default_params, custom_params);
    params.defaultDate=params.defaultDate=="Invalid date"?null:params.defaultDate;
   
    input.flatpickr(params);
}


/****时间关联 （限制时间） */
function associateDate(elem){
    var $this="";
    if(!elem){
        var e=window.event||event; //消除浏览器差异
        $this=$(e.target);
    }else{
        $this=elem;
    }
    
  
    // if(checkNull($this.val())) return false;
    
    var nowdate=removeNull($this.val()); //当前日期
    var $associate_elem="";//关联id
    if($this.attr("data-index")){
        var index=$this.attr("data-index")
        var fieldset_id=$this.closest("div[data-toggle='fieldset']").attr("id")
        var tagets_id=fieldset_id.slice(0, -9)+"-"+index+"-";
        
        var associate_id="#"+tagets_id+$this.attr("data-associate").replace("#","");

       
        $associate_elem=$("#"+fieldset_id).find("tr[data-index='"+index+"'] "+associate_id)

    }else{
        $associate_elem=$($this.attr("data-associate")); 
    }
    
    var associate_type=$this.attr("data-associate_type"); //限制方法 max 限制最大 min 限制最小
    var associateData=removeNull($associate_elem.val()) //关联日期
    //判断如果关联日期不符合则清除                   
    if(associate_type=="max"){  //表示
        var newassociateDate=associateData==""?"":compareDay(nowdate,associateData)=="before"?"":associateData
        initDatetimePicker($associate_elem,{
            maxDate:nowdate==""?null:nowdate+ 24 * 60 * 60 * 1000,
            defaultDate:newassociateDate
        })
    }
    if(associate_type=="min"){  //表示 
        var newassociateDate=associateData==""?"":compareDay(nowdate,associateData)=="after"?"":associateData
        initDatetimePicker($associate_elem,{
            minDate:nowdate==""?null:nowdate+ 24 * 60 * 60 * 1000,
            defaultDate:newassociateDate
        })

    }
}

function selectizes(elem, params){
    var $this=elem
    var elem_id=$this.attr("id")?"#"+$this.attr("id"):"."+$this.attr("class");
    var elemType=$this.attr("id")?"id":"class"
    params=params&& Object.getOwnPropertyNames(params).length>0?params:{};
    var ismMultiple=$this.attr("multiple")?true:false;
    $this.attr("autocomplete","off")
    var defaultParams = {
        plugins: ismMultiple?['remove_button', 'apple_patch']:['apple_patch'],
        valueField: 'value',
        labelField: 'name',
        searchField: 'name',
        options: [],
        loadData:[],
        create: false,
        createOnBlur: true,
        render: {
            option: function(item, escape) {
                return '<div class="option">' + escape(item[labelField]) + '</div>';
            },
            option_create: function (data, escape) {
                return '<div class="create">新增 <strong>' + escape(data.input) + '</strong>&hellip;</div>';
            }
        },
        loads:function () {},
        loadUrl: '',//ipDress+"/des/dictyList",
        data:{},
        onDropdownOpen: function () {},
        defaultData:"",
        onItemAdd: function () {},  
        onItemRemove: function () {}, 
        onChange: function () {}, 
    }
    var settings = {};
    $.extend(settings,defaultParams,params);
    
    var plugins=settings.plugins;
    var valueField=settings.valueField;
    var labelField=settings.labelField;
    var searchField=settings.searchField
    var options=settings.options;
    var loadData=settings.loadData;
    var create=settings.create;
    var createOnBlur=settings.createOnBlur;
    var render=settings.render;
    var loadUrl=settings.loadUrl;
    var data=settings.data;
    var onDropdownOpen=settings.onDropdownOpen;
    var defaultData=settings.defaultData;
    var onItemAdd=settings.onItemAdd;
    var onItemRemove=settings.onItemRemove;
    var onChange=settings.onChange;
    var loads=settings.loads

    
    
    if(ismobiles){ //移动端
        $this.addClass("select")
       
        if(options.length!=0){
            var selectOption='<option  value="">请选择</option>';
            options.map(function(obj){
                var name=obj[labelField];
                var value=obj[valueField]
                selectOption+='<option  value="'+value+'">'+name+'</option>'

            })
            $this.html(selectOption)
        }
        if(defaultData!=""){
           if(indexof(defaultData,",")){
              var newdefaultData=stringToArry(defaultData);
              $this.val(newdefaultData)  

           }else{
            $this.val(defaultData)  
           }

        }
       
 
    }else{
        //pc端
        
        if(!ismMultiple && defaultData!=""){
            var ishas=false;
            options.map(function(objs){
                if(objs[valueField]==defaultData){
                    ishas=true;
                }
            })
            if(!ishas ){
                var option_obj={
                    text:defaultData,
                    value:defaultData,
                    name:defaultData,
                    label:defaultData,
                }
                option_obj[labelField]=defaultData;
                option_obj[valueField]=defaultData;

                options.push(option_obj)

            }
        }
        if(ismMultiple && defaultData!=""){
            if((typeof (defaultData)).toLowerCase()=="string"){ 
                defaultData=stringToArry(defaultData);
            }
            if(Array.isArray(defaultData)){
                defaultData.map(function(rest){
                    var ishas=false;
                    options.map(function(obj){
                        if(obj[valueField]==rest){
                            ishas=true;
                        }
                    })
                    if(!ishas){
                        var option_obj={
                            text:rest,
                            value:rest,
                            name:rest,
                            label:rest,
                        }
                        option_obj[labelField]=rest;
                        option_obj[valueField]=rest;
                        options.push(option_obj)
                    }
                })
            }
        }
        
        /***如果下拉框不存在默认值 则把默认值添加到下拉框中 */
        var selectizeParems={
            plugins: plugins,
            valueField: valueField, //loadUrl!=""?"value":valueField,
            labelField: labelField,//loadUrl!=""?"name":labelField,
            searchField: searchField,
            // options: options,
            create: create,
            createOnBlur:createOnBlur,
            
            // persist: false,
            render: render,
            onDropdownOpen:onDropdownOpen,
            load: function (query, callback) {
                if (!query.length){
                    callback();
                }else{
                    if(!checkNull(loadUrl)){
                        var params={}
                        query=removeNull(query)
                        params[labelField]="%"+query+"%"
                        // params.q=query
                        ajaxFns(params,function(res){
                            var results=res.data;
                            var queryDatas=[];
                            results.map(function(obj){
                                var names=obj[labelField]?obj[labelField]:obj.name?obj.name:"";
                                var values=obj[valueField]?obj[valueField]:obj.value?obj.value:"";
                                var urlObj={
                                    text:names,
                                    value:values,
                                    name:names,
                                }
                                urlObj[labelField]=names,
                                urlObj[valueField]=values,
                                queryDatas.push(urlObj)
                            })
                            callback(queryDatas);
                            loads(queryData)
                        },loadUrl,{erro:function(){
                            callback();
                        }})
                    }else{
                        if(loadData){
                            var queryData=[];
                            loadData.map(function(obj){
                                obj.name=obj[labelField]
                                queryData.push(obj)
                            })
                            queryData.length>0?callback(queryData):callback();
                        }
                    }
                }
            },
            onItemAdd: function(value, $item) {  //选项选中事件
                onItemAdd(value, $item)
            },
            onItemRemove: function(value, $item) {  //选项取消选中事件
                onItemRemove(value, $item);
            },
            onChange: function(value, $item) {  //选项取消选中事件
                onChange(value, $item);
            },

        }
        if(!checkNull(options)){
            selectizeParems.options=options
        }
    
        $this.selectize(selectizeParems);

        if(defaultData!=""){
            if(!checkNull(loadUrl)){
                selectSetVal($this,defaultData,labelField,valueField)
            }else{
                selectSetVal($this,defaultData)
            }
            
            
        }
    }
}


function clearSelectize(elem,callBack){
    var $this=elem
    var $select=$this.selectize();
    var selectize = $select[0].selectize;
    selectize.clear();
    selectize.clearOptions();
    callBack()
}
function clearSelectizeAll(elem,callBack){
    callBack=callBack?callBack:function(){}
    var $this=elem;
    var elem_id=$this.attr("id")?"#"+$this.attr("id"):"."+$this.attr("class");
    var elemType=$this.attr("id")?"id":"class"
    var $select=$this.selectize();
    var selectize = $select[0].selectize;
    selectize.destroy();
    callBack()
}

function addOption(elem, options, callBack){
    callBack=callBack?callBack:function(){}
    var $this=elem;
    var elem_id=$this.attr("id")?"#"+$this.attr("id"):"."+$this.attr("class");
    var $select=$this.selectize();
    var selectize = $select[0].selectize;
    // selectize.clear();
    // selectize.clearOptions();
    var newOptions=[];
    selectize.addOption(options)
    callBack()
   
}
function showOption(elem){
    callBack=callBack?callBack:function(){}
    var $this=elem;
    var $select=$this.selectize();
    var selectize = $select[0].selectize;
    selectize.focus()
}
function selectSetVal(elem, value){
    var $this=elem;
    var $select=$this.selectize();
    var selectize = $select[0].selectize;
    var ismMultiple=$this.attr("multiple")?true:false;
    if(checkNull(value)){
        selectize.setValue("", true); 
    }else {
        // var values=val==0?val.toString():val;
        if(!ismMultiple){
            selectize.setValue(value, true);
            
        }
        if(ismMultiple){
            if((typeof (value)).toLowerCase()=="string"){ 
                value=stringToArry(value);
            }
            selectize.setValue(value, true);
        }
    }
}
jQuery.fn.extend({

})

function layermsg(text,option,callBack){
    callBack=callBack?callBack:function(){};
    var default_params = {
        time:1000,
        icon: 1,
        skin:'',
        tips:2, //tips层的私有参数。支持上右下左四个方向，通过1-4进行方向设定。如tips: 3则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: [1, '#c00']
    }
    var params = $.extend(true, {}, default_params, option);
    
    if(isMobile){

        params.skin='mobile_layer '+params.skin
        params.icon=-1
        layer.msg(text,params,function(){
            callBack()
        })
    }else{
        layer.msg(text,params,function(){
            callBack()
        })
    }
    
}

/*
function addEventListeners(){
    if(isMobile){
        var script = document.createElement("script");
        script.innerHTML=
        `
            if ('addEventListener' in document) {
                document.addEventListener('DOMContentLoaded', function() {
                    FastClick.attach(document.body);
                }, false);
            }
            if(!window.Promise) {
                document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
            }
        `
        document.querySelector ('head').appendChild (script);
    }
}
*/
/****重置cookie中的用户信息 */
function resetUserInfo(obj){
    obj=obj?obj:{}
    var userInfo=localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):{};
    var userindexof=["username","name","dept_id","dept","avatar"]
    if(Object.getOwnPropertyNames(obj).length>0){
        for(var key in obj){
            var values=obj[key];
            if(!checkNull(values) && indexof(userindexof,key)){
                userInfo[key]=values;
            }
        }
    }
    localStorage.setItem("userInfo",JSON.stringify(userInfo));
    
    if(indexof(currentUrl,"/admin")){
        $(".text-default").html(userInfo.name?userInfo.name:"");
        
        var avatar=userInfo.avatar?ipDress+userInfo.avatar:img_ipDress+default_avatar
            
        $(".header .avatar").css("background-image","url("+avatar+")")
    }else{
        if(!ismobiles){
            var avatar=userInfo.avatar?ipDress+userInfo.avatar:img_ipDress+default_avatar;
            $("header .nav-avatar img").attr("src",avatar)
            $(".nav-username em").html(userInfo.name?userInfo.name:"")
        }
    }
}