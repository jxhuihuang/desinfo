require.config({
    baseUrl: '/static/',
    shim: {
        'layer': ['jquery'],
        'layer_ext': ['layer', 'jquery'],
        'flatpickr': ['jquery'],
        'flatpickr.zh': ['flatpickr', 'jquery'],
        'fastclick': {
            deps:['jquery'],
            init:function(FastClick){
                //导出到全局变量，供ueditor使用
                FastClick.attach(document.body);
                // window['ZeroClipboard'] = ZeroClipboard;
            }
        },
        'upload':['jquery'],
        'tool':['jquery'],
        'pages':['jquery'],
        'webheader':['jquery', 'tool'],
        'weui':{
            deps:['jquery'],
            
        },

    },
    paths: {
        'jquery': '/static/lib/plugins/jquery-2.1.4',
        'layer': '/static/plugins/layer-3.1.1/layer',
        'layer_ext': '/static/js/layer_ext',
        'flatpickr': '/static/plugins/flatpickr-4.5.1/flatpickr.min',
        'flatpickr.zh': '/static/plugins/flatpickr-4.5.1/l10n/zh',
        'moment': '/static/plugins/moment-2.22.2/moment-with-locales.min',
        'fastclick': '/static/lib/plugins/fastclick',
        'tool' : '/static/js/tool',
        'pages': '/static/js/pages',
        'webheader':'/static/js/webheader',
        'weui':'/static/lib/plugins/jquery-weui/jquery-weui.min'
    },
    map: {
        '*': {
            'moment': 'moment',
            'layer_ext':'layer_ext'
        }
    },
});

define('main', ['jquery', 'moment', 'fastclick', 'flatpickr.zh'], function($, moment, FastClick) {
    function initMoment() {
        moment.locale("zh-CN");

        function flask_moment_render(elem) {
            $(elem).text(eval('moment("' + $(elem).data('timestamp') + '").' + $(elem).data('format') + ';'));
            $(elem).removeClass('flask-moment').show();
        }

        function flask_moment_render_all() {
            $('.flask-moment').each(function() {
                flask_moment_render(this);
                if ($(this).data('refresh')) {
                    (function(elem, interval) { setInterval(function() { flask_moment_render(elem) }, interval); })(this, $(this).data('refresh'));
                }
            })
        }

        $(document).ready(function() {
            flask_moment_render_all();
        });
    }

    function initDataTables(table, url, custom_params, types) {
        types=types?types:"get";
        var default_params = {
            "responsive": true,
            "pageLength": 10,
            "processing": true,
            "serverSide": true,
            "ajax": {
                url:url,
                type: types,
                beforeSend : function(xhr){
                    var tokens=localStorage.getItem("token");
                    if(tokens && tokens!=""){
                        xhr.setRequestHeader("tokens", tokens);
                    }
                },
            },
            "sPaginationType": "full_numbers",
            "aaSorting": [],    // 初始化不排序
            "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "", //"没有数据"
                "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                "sZeroRecords": "没有检索到数据",
                "sProcessing": "正在加载数据...",
                "sSearch": "搜索：",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                }
            },
        };

        var params = $.extend(true, {}, default_params, custom_params);
        var dt = table.DataTable(params);
        return dt;
    }
    function initDatetimePicker(input, custom_params) {
        custom_params=custom_params?custom_params:{};
        var default_params = {
            locale: "zh"
        };
        var params = $.extend(true, {}, default_params, custom_params);
        input.flatpickr(params);
    }

    // 设置 HTML 5 原生的 type="date" 时最大的日期输入
    function setDateInputMax(element) {
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1;  // 一月是 0
        var year = today.getFullYear();
        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }

        max = year + '-' + month + '-' + day;
        element.attr("max", max)
    }

    function isLessThanToday(element) {
        var date = new Date(Date.parse(element.val().replace(/-/g, '/')));
        var today = new Date();
        return date < today;
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

            var select_data = data.select.field.val();
            
            if (!$.isArray(select_data)) {select_data = [select_data];}

            var flag = ($(select_data).filter(key).length == 0);

            if (!$.isArray(other.items)) {other.items = [other.items];}

            $.each(other.items, function (index, item) {
                var itemField=item.field;
                item.field.prop("hidden", flag);
                var item_label = item.label || $("label[for='" + item.field.attr("id") + "']");
                item_label.prop("hidden", flag);
                if($(itemField).parents(".form-group")){
                    $(itemField).parents(".form-group").attr("hidden", flag)
                }
                if (item.wrap) {item.wrap.prop("hidden", flag);}
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
    /***判断是否是手机 */
    var isMobiles = (function () {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return true //手机端";
        }
        else {
            return false //pc端
        }
    })();
    function fastClick() {
        isMobiles?FastClick.attach(document.body):"";
    }
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
    return {
        initMoment: initMoment,  // Moment 初始化
        initDataTables: initDataTables,  // 表格初始化
        initDatetimePicker: initDatetimePicker,  // 初始化日期选择
        selectedShow: selectedShow,
        setDateInputMax: setDateInputMax,  // 设置 HTML 5 原生的 type="date" 时最大的日期输入
        fastClick: fastClick,
        isLessThanToday: isLessThanToday,
        getWeChatPayResult:getWeChatPayResult,
        navbarToggler:navbarToggler,
    };
});

require(['jquery', 'main'], function ($, main) {
    // 隐藏默认为空的选项
    $("option[value='']").attr("disabled", "disabled").attr("hidden", "hidden");

    main.initMoment();
});