define('portal', ['jquery','layer'], function($,layer) {
    function getWeChatPayResult(out_trade_no, callback) {
        $.ajax({
            url: "/pay/wechat/order",
            type: "GET",
            data: {'out_trade_no': out_trade_no},
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function (result) {
                callback(result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.readyState + ' ' + textStatus, 'error');
            }
        });
    }
    /* 手机端顶部导航收缩*/
    function navbarToggler(){
        var isShow=!$(".navbar-collapse").hasClass("shows");
        var width=document.body.clientWidth;
        $(".navbar-collapse").removeClass("addAnimation")
        $(".navbar-collapse").removeClass("removeAnimation")
        
        if(width<=768){
            if(isShow){
                $("html,body").addClass("html")
                var document_heights=document.body.clientHeight;
                var navbarSpanHt=$(".navbar-span").get(0).offsetHeight;
                $(".navbar-collapse").css({display:"block",height:(document_heights-navbarSpanHt+10)+"px",top:navbarSpanHt+"px"});
                $(".navbar-collapse").addClass("shows addAnimation")
                layer.msg('12',{scrollbar:false,time:0,shadeClose:true,skin:"navbarlay"});
            }
            else{
                $("html,body").removeClass("html")
                $(".navbar-collapse").removeClass("shows")
                $(".navbar-collapse").addClass("removeAnimation")
                layer.closeAll();
            }
        }
    }

    return {
        getWeChatPayResult: getWeChatPayResult,  // 获取微信支付结果
    };
});