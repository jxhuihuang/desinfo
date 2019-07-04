define('admin', ['jquery'], function($) {
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

    return {
        activeMenu: activeMenu,  // 菜单激活
        initDataTablesControls: initDataTablesControls,  // 表格控制信息初始化
    };
});

require(['admin'], function(admin) {
    admin.activeMenu();
});