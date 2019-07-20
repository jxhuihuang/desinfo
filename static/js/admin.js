require.config({
    // baseUrl: '/static/',
    shim: {
        'layer': ['jquery'],
        'layer_ext': ['layer', 'jquery'],
        'datatables': ['jquery'],
        'datatables.bootstrap4': ['datatables', 'jquery'],
        'flatpickr': ['jquery'],
        'flatpickr.zh': ['flatpickr', 'jquery'],
        'bootstrap': ['jquery'],
        'selectize': ['jquery'],
        'dynamicline': ['jquery'],
        'dynamiclines': ['jquery'],
        'selectize_ext': ['jquery', 'selectize'],
        'upload':['jquery'],
        'tool':{
            deps:['jquery'],
        },
        'pages':['jquery'],
        'headerjs':['jquery','tool'],
        'ueditor':{
            deps:["ueditorConfig", "ZeroClipboard"],
            exports:'UE',
            init:function(ZeroClipboard){
                //导出到全局变量，供ueditor使用
                // window['ZeroClipboard'] = ZeroClipboard;
            }
        },
        
        // 'template':['jquery']
    },
    paths: {
        'layer': '/static/plugins/layer-3.1.1/layer',
        'layer_ext': '/static/js/layer_ext',
        'datatables': '/static/plugins/datatables-1.10.19/js/jquery.dataTables.min',
        'datatables.bootstrap4': '/static/plugins/datatables-1.10.19/js/dataTables.bootstrap4.min',
        'flatpickr': '/static/plugins/flatpickr-4.5.1/flatpickr.min',
        'flatpickr.zh': '/static/plugins/flatpickr-4.5.1/l10n/zh',
        'jquery': '/static/plugins/jquery-3.3.1/jquery.min',
        'moment': '/static/plugins/moment-2.22.2/moment-with-locales.min',
        'selectize': '/static/plugins/selectize.js-0.12.6/js/standalone/selectize.min',
        'bootstrap': '/static/plugins/bootstrap-4.1.3/js/bootstrap.bundle.min',
        'autosize': '/static/plugins/autosize-4.0.2/autosize.min',
        'dynamicline': '/static/js/dynamicline',
        'dynamiclines': '/static/js/dynamiclines',
        'selectize_ext': '/static/js/selectize_ext',
        'upload':'/static/js/upload',
        'tool' : '/static/js/tool',
        'pages': '/static/js/pages',
        'headerjs':'/static/js/headerjs',
        "ueditorConfig":"/static/plugins/ueditor1.4.3.3/ueditor.config",
        "ueditor":"/static/plugins/ueditor1.4.3.3/ueditor.all.min",
        // "zh-cn":"/static/plugins/ueditor1.4.3.3/lang/zh-cn/zh-cn",
        "ZeroClipboard": "/static/plugins/ueditor1.4.3.3/third-party/zeroclipboard/ZeroClipboard", //主要是加这句话
        // 'template':'/static/plugins/template/template'
    },
    map: {
        '*': {
            'datatables.net': 'datatables',
            'moment': 'moment'
        }
    },
});

define('admin', ['jquery','layer', 'flatpickr.zh'], function($,layer) {
    function activeMenu() {
        var link = window.location.pathname;
        link = link.replace(/\/$/, "");
        var target = null;
        $(".nav a").each(function () {
            var href = $(this).attr("href");
            if (href && link.includes(href) && (!target || href.length > target.attr("href").length)) {
                target = $(this);
            }
        });

        if (target) {
            target.addClass("active");
            target.closest("li").find("> a").addClass("active");
        }
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
    function initDatetimePicker(input, custom_params) {
        custom_params=custom_params?custom_params:{};
        var default_params = {
            locale: "zh"
        };
        var params = $.extend(true, {}, default_params, custom_params);
        input.flatpickr(params);
    }

    return {
        activeMenu: activeMenu,  // 菜单激活
        initDataTablesControls: initDataTablesControls,  // 表格控制信息初始化
        selectedShow:selectedShow,
        initDatetimePicker:initDatetimePicker,
    };
});

require(['admin'], function(admin) {
    admin.activeMenu();
});