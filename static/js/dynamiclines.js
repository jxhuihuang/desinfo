// 动态行初始化
function dynamicLineInit() {
    $("div[data-toggle=fieldset]").each(function () {
        dynamicLineEvent($(this));
    });
}

// 以下用于动态行
function dynamicLineEvent(container) {
    var $this = container;
    
    $this.find("tr[data-index='0']").find(":input").each(function () {
        // 多层嵌套时会有多个数字在 id 中（需要区分层级）
        var target=$(this).closest("div[data-toggle='fieldset']").attr("id");
        
        var target_id =target?target.slice(0, -9):"";
        
        var elem_nums=0;
        var regex_2 = new RegExp(target_id + "(.*-)\\d{1,4}(-.*)", "m");
        var id = target_id+"-"+elem_nums+"-"+$(this).attr('id');
        $(this).attr('name', id).attr('id', id);
        if ($(this).is(':checkbox')) {
            $(this).prop("checked", false);
        } else {
            $(this).val('');
        }
    });
    // 清空新增行 a 标签和 button 标签的 href 和 

    
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
      
       return {objs, targetkey, thisRow}
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
    
    // 多层嵌套时会有多个数字在 id 中（需要区分层级）
    var regex_1 = new RegExp(target_id + ".*-(\\d{1,4})-.*", "m");
    var elem_num =elem_nums?elem_nums:parseInt(elem_id.replace(regex_1, '$1')) + 1;
    
    // 不考虑多层嵌套情况
    // var elem_num = parseInt(elem_id.replace(/.*-(\d{1,4})-.*/m, '$1')) + 1;

    row.removeAttr("style");    // 删除 style="display: none;"
    row.find(":input").each(function () {
        // 多层嵌套时会有多个数字在 id 中（需要区分层级）
        var regex_2 = new RegExp(target_id + "(.*-)\\d{1,4}(-.*)", "m");
      
        var id =$(this).attr('id')?$(this).attr('id').replace(regex_2, target_id + "$1" + elem_num + "$2"):"";

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
function dynamicSetData(elem, obj, callBack){
    callBack=callBack?callBack:function(){};
    var idType=(typeof (elem)).toLowerCase();
    
    var $elem=idType=="string"?$(elem):idType=="object"?elem:$(elem)
    obj=obj?obj:{};
    var index=$elem.attr("data-index")
    var taget=$elem.closest("div[data-toggle='fieldset']").attr("id");
   
    var target_id =taget.slice(0, -9)+"-"+index+"-";
    $elem.find(":input").each(function(result){
        var $this=$(this);
        var name=$this.attr("name")?$this.attr("name").replace(target_id,""):"";
        
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

                if($this.next().hasClass("selectize-control")){
                     $this.selectSetVal(values)
                }else{
                    $(this).val(values)
                }
                
                
            }else if($this.is("textarea")){
                $(this).val(values)
            }else{
                $(this).val(values)
            }

            
            
        }
    })
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
    var taget=$(id).attr("id")
    $(id).find("tbody tr").each(function(obj,i){
        
        var index=$(this).attr("data-index");
        var target_id =taget.slice(0, -9)+"-"+index+"-";
        if(index!=0){
            var objs={}
            var EmptyData=[]
            $(this).find(":input:visible:not(:button)").each(function(){
                var $this=$(this)
                if($this.is("input")){ 
                    var type=removeNull($this.attr("type"));
                    switch (type){
                        case "date":
                            var name=checkNull($this.attr("name"))?$this.prev().attr('name'):$this.attr("name");
                            var keys=!checkNull(name)?name.replace(target_id,""):"";
                            if(!checkNull(keys)){
                                var values=removeNull($this.val());
                                values=Array.isArray(values)?values.join(","):values
                                objs[keys]=values
                            }
                        break;
                        case "checkbox":
                            var name=checkNull($this.attr("name"))
                            var keys=!checkNull(name)?name.replace(target_id,""):"";   
                            if(!checkNull(keys)){
                                var checkvalues=$this.attr("checked");
                                objs[keys]=checkvalues
                            }
                        break;

                        case "file":
                        break;

                        default:
                            if(isMobile){
                                var name=removeNull($(this).attr('name'));
                                var keys=!checkNull(name)?name.replace(target_id,""):"";
                                if(!checkNull(keys)){
                                    value = removeNull($(this).val());
                                    value=Array.isArray(value)?value.join(","):value
                                    objs[keys]=value
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
                                var keys=!checkNull(name)?name.replace(target_id,""):"";
                                if(!checkNull(keys)){
                                    value=Array.isArray(value)?value.join(","):value
                                    objs[keys]=value
                                }  
                            }
                        break;
                    }
                }
               
               
                if($this.is("select")){
                    var name=$this.attr("name");
                    var keys=name?name.replace(target_id,""):"";
                    var values=removeNull($(this).val());
                    values=Array.isArray(values)?values.join(","):values
                  
                    objs[keys]=values
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