!
function(t,s){
    s={};
    
    
    
    
    /*
    * counts 数据总数
    * linePages 每页多少条
    * currentPage 当前页
    * pages   总页数
    * prev:"上一页",  //&lt;
    * next:"下一页",   //&gt;
    */
    function page(params,$this){
        var defaultParams = {
            counts:0,
            linePages:10,
            currentPage:1,
            showCounts:false,
            prev:"上一页",  //&lt;
            next:"下一页",   //&gt;
            ismobile:false,
        }
        var settings = {};
        $.extend(settings,defaultParams,params);

        var counts=settings.counts;
        var linePages=settings.linePages;
        var currentPage=settings.currentPage;
        var showCounts=settings.showCounts;
        var prev=settings.prev;
        var next=settings.next;
        var ismobile=settings.ismobile;
        currentPage=parseInt(currentPage);
        counts=parseInt(counts);
        linePages=parseInt(linePages);
        if(linePages>counts){
            linePages=counts
        }
        var pagesNum=counts%linePages==0?counts/linePages:parseInt(counts/linePages)+1; //共多少页
        if(currentPage>pagesNum){
            currentPage=pagesNum;
        }
        if(currentPage==0){
            currentPage=1
        }
        //显示条数信息
        var startRow=(parseInt(currentPage)-1)* parseInt(linePages)+1;
        var endRow=currentPage*linePages>counts?counts:currentPage*linePages
    
        var pageList='';
        
        //获取上一页 下一页 
        //上一页
        var prepage; 
    
    if(pagesNum>1){
        if(currentPage==1){
            prepage='<span class="previous disabled"><a href="javascript:void(0);" data-page="'+(currentPage-1)+'">'+prev+'</a></span>';
        }else{
            prepage='<span class="previous"><a href="javascript:void(0)" data-page="'+(currentPage-1)+'">'+prev+'</a></span>';
        }
    }
    //下一页
    var nextpage;
    if(pagesNum>1){
        if(currentPage==pagesNum){
        nextpage='<span class="nextvious disabled"><a href="javascript:void(0)" data-page="'+(currentPage+1)+'">'+next+'</a></span>';
        }else{
        nextpage='<span class="nextvious"><a href="javascript:void(0)" data-page="'+(currentPage+1)+'">'+next+'</a></span>';
        }
    }

        var shenyuh='<span class="disabled"><a href="javascript:void(0)">…</a></span>';  //省略号
        var firstpage='<span><a href="javascript:void(0)" data-page="1">1</a></span>';  //首页
        var lastpage='<span><a href="javascript:void(0)" data-page="'+pagesNum+'">'+pagesNum+'</a></span>';  //末页

    //设置分页
        if(pagesNum>1){
            if(pagesNum<=5){
                var yepage='';
                for(var i=1; i<=pagesNum;i++){
                    if(i==currentPage){
                        yepage+='<span class="active"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>';
                    }else{
                        yepage+='<span><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>';
                    }
                }//for结束
                pageList+=prepage+yepage+nextpage;
            }
            if(pagesNum>5){
                if(currentPage<5){
                    var yepage='';
                    for(var i=1; i<=5;i++){   
                        if(i==currentPage){
                            yepage+='<span class="active"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>'
                        }else{
                            yepage+='<span><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>';
                        }
                    }
                    pageList+=prepage+yepage+shenyuh+lastpage+nextpage;
                }
                if(currentPage>=5 && currentPage<=pagesNum-4){
                    var yepage2='';
                    pageList+=prepage+firstpage+shenyuh
                    for(var i=currentPage-2; i<=currentPage-1;i++){
                        yepage2+='<span><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>'
                    }
                    var currentpages='<span class="active"><a href="javascript:void(0)" data-page="'+currentPage+'">'+currentPage+'</a></span>'
                    pageList+=yepage2+currentpages
                    var yepage3='';
                    for(var i=currentPage+1; i<=currentPage+2;i++){
                        yepage3+='<span><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>'
                    }
                    pageList+=yepage3+shenyuh+lastpage+nextpage;
                }
                if(currentPage>pagesNum-4 && currentPage>4){
                    var yepage2='';
                    for(var i=pagesNum-4; i<=pagesNum;i++){
                        if(i==currentPage){
                            yepage2+='<span class="active"><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>'
                        }else{
                            yepage2+='<span><a href="javascript:void(0)" data-page="'+i+'">'+i+'</a></span>';
                        }
                    }
                    pageList+=prepage+firstpage+shenyuh+yepage2+nextpage

                } 
            }
        }    


        var pageMain='';
        
        pageMain+='<div class="pagesination">';
        pageMain+=pageList;
        pageMain+='</div>';

        if(pagesNum>1){
            var innerWidth=isMobile=="true"?window.innerWidth:document.body.clientWidth;
            if(innerWidth>=640){
                showCounts?
                    $this.html('<div class="pages_main "><div class="row">'+pagesizeshow(startRow,endRow,counts)+pageMain+'</div></div>')
                :
                    $this.html('<div class="pages_main text-c">'+pageMain+'</div>')

            }else{
                $this.html('<div class="pages_main text-c"><div class="pagesination">'+prepage+nextpage+'</div></div>')
            }
        }else{
            $this.html("")
        }
        

        //$this.html(pagesizeshow(startRow,endRow,counts)+pageMain)
    }


    /*去除""或undefind null*/
    function isnull(str) {
        if (str == null || str == undefined || str == "undefined") {
            return "";
        }
        else {
            return str;
        }
    }

    t.fn.pages=function(params){
        var $this=$(this);
        page(params,$this);
    }
    
    
    function pagesizeshow(startRow,endRow,counts){
        var pagesizeshow="";
        pagesizeshow+='<div class="pagesination pageNum">'
        pagesizeshow+='<div aria-live="polite"  role="status" id="datagrid_info" class="dataTables_info">'
        if(startRow==endRow){
            pagesizeshow+='显示第'+startRow+'条记录，共'+counts+'条记录'
        }else{
            pagesizeshow+='显示第'+startRow+'到第'+endRow+'条记录，共'+counts+'条记录'
        }
        
        pagesizeshow+='</div>'
        pagesizeshow+='</div>'
        return pagesizeshow;
    }

}(jQuery, window, document)

/* 点击分页 */
jQuery.fn.extend({
    pageclick:function(callback) {
        var $this=$(this);
        $this.delegate('.pagesination span', 'click', function(){
            if(!$(this).hasClass("disabled") &&!$(this).hasClass("active")){
                var currentPages=parseInt($(this).find("a").attr("data-page"));
                callback(currentPages,$(this))
            }
        });
    }
});