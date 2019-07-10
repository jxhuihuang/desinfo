require.config({
    baseUrl: '/static/',
   
    paths: {
        'jquery': '/static/plugins/jquery-3.3.1/jquery.min',
        'layer': '/static/plugins/layer-3.1.1/layer',
        'layer_ext': '/static/js/layer_ext',
        'tool' : 'js/tool',
    },
    shim: {
        // 'jquery':{
        //     exports:"$"
        // },
        'layer': ['jquery'],
        'layer_ext': ['layer', 'jquery'],
        'tool':{
            deps:['jquery'],
        },
    },
});
define('portal', ['jquery','layer'], function($,layer) {
    
    
    /*去除""或undefind null*/
    function checkNull(obj) {
        if (obj === null || typeof (obj) === "undefined") {
            return "";
        }
        var type = (typeof (obj)).toLowerCase();
        if (type === "string" && (obj.toString()).replace(/(^\s*)|(\s*$)/g, "") === "") {
            return "";
        }
        return obj;
    }
    //生成时间戳
    function Timestamp() {
        var datetime = Date.parse(new Date());
        return datetime / 1000;
    }
    
    /*
    页面div中显示信息
    *
    显示方式
    showmsg({
    msg:"",  //显示的信息,
    isbtn:"",   //是否显示按钮,
    url:"",//点击按钮时的跳转链接 为空时为刷新,
    icon:"",//错误图片,
    btntext:"",//按钮文字,
    classname:"",//样式名
    })
    */

    /**显示template模板 */
    function showtemp(data,listTmpl, id, callback){
        var datas=data?data:[];
        var callback=callback?callback:function(){};
        if(datas.length==0){
            $(id).html(showmsg({msg:"没有检索到数据"}))
        }else{
            var templates=template(listTmpl, {list:data});
            $(id).html(templates)
        }
    }
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

   //判断移动端还是电脑端
    var isMobile = (function () {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return true //手机端";
        }
        else {
            return false//pc端
        }
    })();
    
    return {
        checkNull:checkNull,
        showtemp:showtemp,
        Timestamp:Timestamp,
        layermsg:layermsg,
        
        // imgChange:imgChange,
    };
});

