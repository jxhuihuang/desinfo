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
        var target_id=$(this).data("target")
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
            var  parent = $(this).closest("[data-toggle=fieldset]")
            thisRow.remove();
            $this.trigger("rowremove",removerow(thisRow, parent));
        }
    });
    function removerow(thisRow,parent){
       var objs={}
       var thisId=parent.attr("id")
       var targetkey = thisId.slice(0, -9); //当前删除的总字段
       
       thisRow.find(":input").each(function(){
            var name=$(this).attr("name");
            if(!checkNull(name)){
                var type=removeNull($(this).attr("type"));
                switch (type){
                    case "checkbox":
                        if(objs[name]=="1" || objs[name]=="y"){
                            objs[name]="1"
                        }else{
                            objs[name]="0"
                        }
                    break;
                    case "file":
                    break;
                    default:
                        var values=removeNull($(this).val());
                        objs[name]=values
                    break;
                }
            }
        })

       return {objs, targetkey, thisRow};
    }
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
function addRow(target, callBack, params) {
    callBack=callBack?callBack:function(){};
    params=params?params:{};
    elem_nums=params.elem_nums?params.elem_nums:"";
    
    var target_id = target.attr('id').slice(0, -9);
    var oldrow = target.find("[data-toggle=fieldset-entry]:last");
    
    var old_index=!checkNull(target.find("[data-toggle=fieldset-entry]:last").attr("data-index"))?parseInt(target.find("[data-toggle=fieldset-entry]:last").attr("data-index")):0;
    // 使用 Selectize 时需要在 clone 前 destroy 初始化好的 selectize 实例
   
    // var newRow=$('<code></code>').append(oldrow);
    var selectize_elements = {};
    // oldrow.find('select').each(function() {
    //     if ($(this)[0].selectize){
    //         // Store last row's current options and value(s) to restore after destroying for clone purposes
    //         selectize_elements[$(this).attr('id')] = {
    //             options: $(this)[0].selectize.options,
    //             value: $(this)[0].selectize.getValue()
    //         };
    //         // Destroy the selectize.js element
    //         $(this)[0].selectize.destroy();
    //     }
    // });
    var row =oldrow.clone(true, true);
    row.find('select').each(function(){
        if($(this).parent().find(".selectize-control").length>0){
            if ($(this)[0].selectize){
                selectize_elements[$(this).attr('id')] = {
                    options: $(this)[0].selectize.options,
                    value: $(this)[0].selectize.getValue()
                };
            }
            var select=$(this)
            $(this).parent().html(select)
        }
    });

    var elem_id = row.find(":input")[0].id;
    var index=elem_nums!=""?elem_nums:old_index+1
    
    row.attr("data-index",index)
    row.removeAttr("style");    // 删除 style="display: none;"
    row.find(":input").each(function () {
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
    callBack({new_row: row, old_row: oldrow, selectize_elements: selectize_elements, index:index})
    return {new_row: row, old_row: oldrow, selectize_elements: selectize_elements, index:index};
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
        var row1Index=row1.attr("data-index")
        var row2Index=row2.attr("data-index")
        row1.attr("data-index",row2Index)
        row2.attr("data-index",row1Index)
    }
}

// 设置默认值
function dynamicSetData(elem, datas, callBack){
    var target=$(elem);
    datas=datas?datas:[]; 
    callBack=callBack?callBack:function(){};
    if(datas.length>0){
        datas.map(function(objs,i){
            var key=0
            var elem_num=objs.index?objs.index:i+1;
            addRow(target,elem_num,function(res){
                var new_row=res.new_row;
                for(var names in objs){
                    var value=objs[names];
                    if($("#"+names).is("checkbox")){
                        if(value=="1" || value=="y"){
                            new_row.find("#"+names).attr("checked",true);
                        }else{
                            new_row.find("#"+names).attr("checked",false);
                        }
                    }else{
                        new_row.find("#"+names).val(value)
                    }
                    
                }
                
            })    
        })
        callBack(elem)
    }
}

function SetTableData(row,obj){
    for(var names in objs){
        var value=objs[names];
        if($("#"+names).is("checkbox")){
            if(value=="1" || value=="y"){
                new_row.find("#"+names).attr("checked",true);
            }else{
                new_row.find("#"+names).attr("checked",false);
            }
        }else{
            new_row.find("#"+names).val(value)
        }
        
    }

}

//获取表格值
function getTableData(id){
    var tableData=[];
    var isEmpty=false;
    $(id).find("tbody tr").each(function(obj,i){
        var index=$(this).attr("data-index");
        
        if(index!=0){
            var objs={}
            var EmptyData=[]
            $(this).find(":input").each(function(){
                var name=$(this).attr("name");
                var $this=$(this)
                if(checkNull(name) && $this.attr("type")=="date"){
                    var names=$this.prev().attr('name')?$this.prev().attr('name'):"";
                    if(checkNull(names)){
                        var values=removeNull($(this).val());
                        values=Array.isArray(values)?values.join(","):values
                        objs[names]=values
                    }
                   

                }
                if(!checkNull(name)){
                    if($this.is("input")){
                        var type=removeNull($(this).attr("type"));
                        switch (type){
                            case "checkbox":
                                if(objs[name]=="1" || objs[name]=="y"){
                                    objs[name]="1"
                                }else{
                                    objs[name]="0"
                                }
                            break;
                            case "file":
                            break;
                            default:
                                var values=removeNull($(this).val());
                                values=Array.isArray(values)?values.join(","):values
                                objs[name]=values
                            break;
                        }
                    }

                    
                    
                }
                if($this.is("select")){
                    
                    var values=removeNull($(this).val());
                    values=Array.isArray(values)?values.join(","):values
                    objs[name]=values
                }

            })
           
            if(!isEmpty){
                for(var k in objs){
                    var values=removeNull(objs[k]);
                    values!=""?EmptyData.push(values):""
                }
                if(EmptyData.length<=0){
                    isEmpty=true
                }
            }
            objs.index=index;
            tableData.push(objs)
        }
    })
   
    return { tableData, isEmpty};
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
/********* 表单序列化 *********/

function serializeArray_dy(formID){
    var fields=formID.serializeArray();
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
    formID.find("input[type=checkbox]").each(function(result){
        var name=$(this).attr("name")
        if(name && name!=""){
            var checked=$(this).prop("checked");
            if(checked){
                datas[name]="1"
            }else{
                datas[name]="0"
            }
        }
    })
    return  datas
}