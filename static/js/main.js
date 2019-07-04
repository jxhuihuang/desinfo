require.config({
    shim: {
        'layer': ['jquery'],
        'layer_ext': ['layer', 'jquery'],
        'datatables': ['jquery'],
        'datatables.bootstrap4': ['datatables', 'jquery'],
        'flatpickr': ['jquery'],
        'flatpickr.zh': ['flatpickr', 'jquery'],
        'bootstrap': ['jquery'],
        'fastclick': ['jquery'],
        'selectize': ['jquery'],
        'dynamicline': ['jquery'],
        'selectize_ext': ['jquery', 'selectize'],
    },
    paths: {
        // 'layer': '/static/plugins/layer-3.1.1/layer',
        // 'layer_ext': '/static/js/layer_ext',
        // 'datatables': '/static/plugins/datatables-1.10.19/js/jquery.dataTables.min',
        // 'datatables.bootstrap4': '/static/plugins/datatables-1.10.19/js/dataTables.bootstrap4.min',
        // 'flatpickr': '/static/plugins/flatpickr-4.5.1/flatpickr.min',
        // 'flatpickr.zh': '/static/plugins/flatpickr-4.5.1/l10n/zh',
        // 'jquery': '/static/plugins/jquery-3.3.1/jquery.min',
        // 'moment': '/static/plugins/moment-2.22.2/moment-with-locales.min',
        // 'selectize': '/static/plugins/selectize.js-0.12.6/js/standalone/selectize.min',
        // 'bootstrap': '/static/plugins/bootstrap-4.1.3/js/bootstrap.bundle.min',
        // 'autosize': '/static/plugins/autosize-4.0.2/autosize.min',
        // 'fastclick': '/static/plugins/fastclick-1.0.6/fastclick',
        // 'dynamicline': '/static/js/dynamicline',
        // 'selectize_ext': '/static/js/selectize_ext',

        'layer': '/static/plugins/layer-3.1.1/layer',
        'layer_ext': '/static/js/layer_ext.min',
        'datatables': 'https://cdn.staticfile.org/datatables/1.10.19/js/jquery.dataTables.min',
        'datatables.bootstrap4': 'https://cdn.staticfile.org/datatables/1.10.19/js/dataTables.bootstrap4.min',
        'flatpickr': 'https://cdn.staticfile.org/flatpickr/4.5.2/flatpickr.min',
        'flatpickr.zh': 'https://cdn.staticfile.org/flatpickr/4.5.2/l10n/zh',
        'jquery': 'https://cdn.staticfile.org/jquery/3.3.1/jquery.min',
        'moment': 'https://cdn.staticfile.org/moment.js/2.22.2/moment-with-locales.min',
        'selectize': 'https://cdn.staticfile.org/selectize.js/0.12.6/js/standalone/selectize.min',
        'bootstrap': 'https://cdn.staticfile.org/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min',
        'autosize': 'https://cdn.staticfile.org/autosize.js/4.0.2/autosize.min',
        'fastclick': 'https://cdn.staticfile.org/fastclick/1.0.6/fastclick.min',
        'dynamicline': '/static/js/dynamicline.min',
        'selectize_ext': '/static/js/selectize_ext.min',
    },
    map: {
        '*': {
            'datatables.net': 'datatables',
        }
    },
});

define('main', ['jquery', 'moment', 'fastclick', 'datatables.bootstrap4', 'flatpickr.zh'], function($, moment, FastClick) {
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

    function initDataTables(table, url, custom_params) {
        var default_params = {
            "responsive": true,
            "pageLength": 10,
            "processing": true,
            "serverSide": true,
            "ajax": url,
            "sPaginationType": "full_numbers",
            "aaSorting": [],    // 初始化不排序
            "ordering": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                "sInfoEmpty": "没有数据",
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

    function initDatetimePicker(input, custom_params={}) {
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

    function selectedShow(data) {
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

        $.each(data.others, function (index, other) {
            var key = other.key;
            if (!$.isArray(key)) {key = [key];}

            var select_data = data.select.field.val();
            if (!$.isArray(select_data)) {select_data = [select_data];}

            var flag = ($(select_data).filter(key).length == 0);

            if (!$.isArray(other.items)) {other.items = [other.items];}

            $.each(other.items, function (index, item) {
                item.field.prop("hidden", flag);
                var item_label = item.label || $("label[for='" + item.field.attr("id") + "']");
                item_label.prop("hidden", flag);
                if (item.wrap) {item.wrap.prop("hidden", flag);}
                if (!flag && data.select.wrap) {match = true;}
            });
        });

        if (match && data.select.wrap_class_selected) {
            data.select.wrap.attr("class", data.select.wrap_class_selected);
        } else if (!match && data.select.wrap_class_original) {
            data.select.wrap.attr("class", data.select.wrap_class_original);
        }
    }

    function fastClick() {
        FastClick.attach(document.body);
    }

    return {
        initMoment: initMoment,  // Moment 初始化
        initDataTables: initDataTables,  // 表格初始化
        initDatetimePicker: initDatetimePicker,  // 初始化日期选择
        selectedShow: selectedShow,
        setDateInputMax: setDateInputMax,  // 设置 HTML 5 原生的 type="date" 时最大的日期输入
        fastClick: fastClick,
        isLessThanToday: isLessThanToday,
    };
});

require(['jquery', 'main'], function ($, main) {
    // 隐藏默认为空的选项
    $("option[value='']").attr("disabled", "disabled").attr("hidden", "hidden");

    main.initMoment();
});