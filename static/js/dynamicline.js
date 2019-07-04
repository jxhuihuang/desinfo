// 动态行初始化
function dynamicLineInit() {
    $("div[data-toggle=fieldset]").each(function () {
        dynamicLineEvent($(this));
    });
}

// 以下用于动态行
function dynamicLineEvent(container) {
    var $this = container;
    // 增加新行
    $this.find("[data-toggle=fieldset-add-row]").on('click', function () {
        var target = $($(this).data("target"));

        $this.trigger("rowadded", addRow(target));
        /* 添加一个 event
        $("div[data-toggle=fieldset]").on("rowadded", function (e, params) {
            var new_row = params.new_row;
            var old_row = params.old_row;
            var selectize_elements = params.selectize_elements;

            // Do Something Example
            var options = {};
            new_row.find("[id^='items-'][id$='-item_attribute']").selectize(options);
            old_row.find("[id^='items-'][id$='-item_attribute']").selectize(options);

            if (!$.isEmptyObject(selectize_elements)) {
                // Copy back options and values to cloned row
                $.each(selectize_elements, function (key, item) {
                    old_row.find('select#' + key)[0].selectize.options = item.options;
                    old_row.find('select#' + key)[0].selectize.setValue(item.value);
                });
            }
        });
        */
    });

    // 删除行
    $this.find("[data-toggle=fieldset-remove-row]").on('click', function () {
        if ($this.find("[data-toggle=fieldset-entry]").length > 1) {
            var thisRow = $(this).closest("[data-toggle=fieldset-entry]");
            thisRow.remove();
        }
    });

    // 清空所有元素
    $this.find("[data-toggle=fieldset-clear-all]").on('click', function () {
        var target = $($(this).data("target"));
        clearContent(target);
    });

    // 上移
    $this.find("[data-toggle=fieldset-up-row]").click(function () {
        var thisRow = $(this).closest("[data-toggle=fieldset-entry]");
        var prevRow = thisRow.prevAll(":visible:first");
        exchangeRow(thisRow, prevRow);
    });

    // 下移
    $this.find("[data-toggle=fieldset-down-row]").click(function () {
        var thisRow = $(this).closest("[data-toggle=fieldset-entry]");
        var nextRow = thisRow.nextAll(":visible:first");
        exchangeRow(nextRow, thisRow);
    });
}

// 新增行
function addRow(target, elem_nums, callBack) {
    elem_nums=elem_nums?elem_nums:"";
    callBack=callBack?callBack:function(){};
    var target_id = target.attr('id').slice(0, -9);
    var oldrow = target.find("[data-toggle=fieldset-entry]:last");

    // 使用 Selectize 时需要在 clone 前 destroy 初始化好的 selectize 实例
    var selectize_elements = {};
    oldrow.find('select').each(function() {
        if ($(this)[0].selectize){
            // Store last row's current options and value(s) to restore after destroying for clone purposes
            selectize_elements[$(this).attr('id')] = {
                options: $(this)[0].selectize.options,
                value: $(this)[0].selectize.getValue()
            };

            // Destroy the selectize.js element
            $(this)[0].selectize.destroy();
        }
    });

    var row = oldrow.clone(true, true);
    var elem_id = row.find(":input")[0].id;

    // 多层嵌套时会有多个数字在 id 中（需要区分层级）
    var regex_1 = new RegExp(target_id + ".*-(\\d{1,4})-.*", "m");
    var elem_num =elem_nums?elem_nums:parseInt(elem_id.replace(regex_1, '$1')) + 1;
    
    // 不考虑多层嵌套情况
    // var elem_num = parseInt(elem_id.replace(/.*-(\d{1,4})-.*/m, '$1')) + 1;

    row.removeAttr("style");    // 删除 style="display: none;"
    row.find(":input").each(function () {
        // 多层嵌套时会有多个数字在 id 中（需要区分层级）
        var regex_2 = new RegExp(target_id + "(.*-)\\d{1,4}(-.*)", "m");
        var id = $(this).attr('id').replace(regex_2, target_id + "$1" + elem_num + "$2");

        // 不考虑多层嵌套情况
        // var id = $(this).attr('id').replace('-' + (elem_num - 1) + '-', '-' + (elem_num) + '-');
        $(this).attr('name', id).attr('id', id);
        if ($(this).is(':checkbox')) {
            $(this).prop("checked", false);
        } else {
            $(this).val('');
        }
    });

    // 清空新增行 a 标签和 button 标签的 href 和 onclick 属性
    row.find("a").each(function () {
        if ($(this).attr('href')) $(this).attr('href', '#');
        if ($(this).attr('onclick')) $(this).attr('onclick', '');
    });
    row.find("button").each(function () {
        if ($(this).attr('onclick')) $(this).attr('onclick', '');
    });

    // 删除显示设置的忽略元素
    $(".ignore", row).remove();

    oldrow.after(row);
    callBack({new_row: row, old_row: oldrow, selectize_elements: selectize_elements})
    return {new_row: row, old_row: oldrow, selectize_elements: selectize_elements};
}

// 清空所有行
function clearContent(target) {
    target.find("[data-toggle=fieldset-entry]:visible").find(":input").each(function () {
        $(this).val("");
    });
}

// 交换行
function exchangeRow(row1, row2) {
    if (row1.prop("tagName") == "TR" && row2.prop("tagName") == "TR" && row1.children("td").length == row2.children("td").length) {
        row1.after(row2);
        for (i = 0; i < row1.children("td").length; i++) {
            var elem_row1 = row1.children("td").eq(i).children(":first");
            var elem_row2 = row2.children("td").eq(i).children(":first");

            var id_row1 = elem_row1.attr('id');
            var id_row2 = elem_row2.attr('id');

            if (id_row1 && id_row2) {
                elem_row1.attr('id', id_row2);
                elem_row2.attr('id', id_row1);
            }

            var name_row1 = elem_row1.attr('name');
            var name_row2 = elem_row2.attr('name');

            if (name_row1 && name_row2) {
                elem_row1.attr('name', name_row2);
                elem_row2.attr('name', name_row1);
            }
        }
    }
}

// 设置默认值
function dynamicSetData(elem, datas,callBack){

    var target=$(elem);
    var target_id = target.attr('id').slice(0, -9);
    datas=datas?datas:[]; 
    callBack=callBack?callBack:function(){};
    if(datas.length>0){
        datas.map(function(objs,i){
            var key=0
            var elem_num='';
            for(var names in objs){
                key=key+1
                if(key==1){
                    var regex_1 = new RegExp(target_id + ".*-(\\d{1,4})-.*", "m");
                    elem_num = parseInt(names.replace(regex_1, '$1'));
                }
            }
            addRow(target,elem_num,function(res){
                var new_row=res.new_row;
                for(var names in objs){
                    var value=objs[names];
                    new_row.find("#"+names).val(value)
                }
            })    
        })
        callBack(elem)
    }
}
//获取表格值
function getTableData(id){
    //medication_record-fieldset
    var tableData=[];
    $(id).find("tbody tr").each(function(obj,i){
        var target_id = $(id).attr('id').slice(0, -9);
       
        
        var objs={}
        $(this).find(".form-input").each(function(){
            var name=$(this).attr("name")
            if(name){
                var regex_1 = new RegExp(target_id + ".*-(\\d{1,4})-.*", "m");
                elem_num = parseInt(name.replace(regex_1, '$1'));
                if(elem_num!=0){
                    var values=removeNull($(this).val());
                    objs[name]=values
                }
            }
        })
        $(this).find("input[type=checkbox]").each(function(result){
            var name=$(this).attr("name")
            if(name && name!=""){
                var checked=$(this).prop("checked");
                if(checked){
                    objs[name]="1"
                }else{
                    objs[name]="0"
                }
            }
        })
        tableData.push(objs)
    })
    return tableData;
}
/* 动态表格模板
<div class="table-responsive" data-toggle="fieldset" id="medication_record-fieldset">
    <table class="table mb-0">
        <thead>
        <tr>
            <th class="pl-0">Column Name</th>
            <th>Column Name</th>
            <th class="pr-0 text-right w-8">
                <a class="icon" data-toggle="fieldset-add-row" data-target="#item-fieldset"><i class="fe fe-plus"></i></a>
                <a class="icon" data-toggle="fieldset-clear-all" data-target="#item-fieldset"><i class="fe fe-x"></i></a>
            </th>
        </tr>
        </thead>
        <tbody>
        {% for item in form.items %}
            <tr data-toggle="fieldset-entry">
                <td class="pl-0">{{ item.select_field(class_="custom-select") }}</td>
                <td>{{ item.string_field(class_="form-control") }}</td>
                <td class="pr-0 text-right align-middle">
                    <a class="icon" data-toggle="fieldset-up-row" id="item-{{ loop.index0 }}-up"><i class="fe fe-arrow-up"></i></a>
                    <a class="icon" data-toggle="fieldset-down-row" id="item-{{ loop.index0 }}-down"><i class="fe fe-arrow-down"></i></a>
                    <a class="icon" data-toggle="fieldset-remove-row" id="item-{{ loop.index0 }}-remove"><i class="fe fe-trash"></i></a>
                </td>
            </tr>
        {% endfor %}
        </tbody>
    </table>
</div>
*/
