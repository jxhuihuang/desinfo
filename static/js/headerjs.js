var navColumns=[
    {
        name:"仪表盘",
        link:"/admin/dashboard",
        chirld:[]
    },
    {
        name:"系统配置",
        chirld:[
            {
                name:"系统配置",
                link:"/admin/system"
            },
            {
                name:"菜单管理",
                link:"/admin/menu",
            },
            {
                name:"组织机构管理",
                link:"/admin/dept",
            },
            {
                name:"角色管理",
                link:"/admin/role",
            },
            {
                name:"用户管理",
                link:"/admin/user",
            },
            {
                name:"账户日志",
                link:"/admin/user/account/log",
            },
            {
                name:"字典管理",
                link:"/admin/dict",
            }
        ]
    },
    {
        name:" 业务管理",
        chirld:[
            {
                name:"生产厂家管理",
                link:"/admin/drug/manufacturer",
            },
            {
                name:"药品管理",
                link:"/admin/drug",
            },
            {
                name:"报告管理",
                link:"/admin/report",
            },
            {
                name:'疾病管理',
                link:'/admin/disease'
            }
        ],

    },{
        name:" 通知公告",
        link:"/admin/articles",
        chirld:[]
    }
]
$(function(){
    getcmsData()
    if(localStorage.getItem("userInfo")){
        var userInfo=JSON.parse(localStorage.getItem("userInfo"));
        $(".text-default").html(userInfo.name?userInfo.name:"");
        var avatar=userInfo.avatar?ipDress+userInfo.avatar:img_ipDress+default_avatar;
        $(".header .avatar").css("background-image","url("+avatar+")")
    }

    $(".log-out").on("click",function(){
        var e=window.event||event; //消除浏览器差异 
        e.preventDefault();
        ajaxFns({},function(res){
            if(res.resultCode=="0"){
                layer.msg("用户登出成功",{time: 1000, icon: 1},function(){
                    localStorage.removeItem("token");
                    localStorage.removeItem("userInfo")
                    window.location.href="../../../admin/auth/login"
                })
            }
        },ipDress+"/des/logout")
    })

    /****侧边栏 */
    getNav(function(res){
        var currentUrl=getCurrentUrl()
        currentUrl=currentUrl.indexOf("?")>0?currentUrl.split("?")[0]:currentUrl;
        currentUrl=currentUrl.indexOf("/add")>0?currentUrl.split("/add")[0]:currentUrl;
        currentUrl=currentUrl.indexOf("/edit")>0?currentUrl.split("/edit")[0]:currentUrl;
       
        navsGetpermission(navColumns, res, function(newnavColumns){
            var navbarList='';
            navColumns.map(function(obj){
               
                if(obj.permission){
                    if(obj.chirld.length<=0 && !checkNull(obj.link)){
                        var link=obj.link;
                        navbarList+= currentUrl==link?'<li class="sider-item nodrop ative">':'<li class="sider-item  nodrop">'
                            navbarList+='<a href="'+link+'" class="nav-link">'
                            navbarList+='<i class="fe fe-folder"></i>'
                            navbarList+=obj.name
                            navbarList+='</a>'
                        navbarList+='</li>'
                    }
                    if(obj.chirld.length>0){
                        navbarList+='<li class="sider-item">'
                            navbarList+='<a href="" class="nav-link toggle_up" data-toggle="dropdowns" onclick="dropdown(event)">'
                            navbarList+='<em> <i class="fe fe-folder"></i>'+obj.name+'</em><span class="fa-chevron-down"><i class="myIconfont drops">&#xe82d;</i></span>'
                            navbarList+='</a>'
                            navbarList+='<dl class="dropdown-menus">'
                        obj.chirld.map(function(objs){
                            if(objs.permission && !checkNull(objs.link)){
                                navbarList+=currentUrl==objs.link?'<dd class="ative">':'<dd>'
                                navbarList+='<a class="nav-link" href="'+objs.link+'">'
                                    navbarList+='<i class="fe fe-file"></i>'+objs.name
                                navbarList+='</a>'
                                navbarList+='</dd>'
                            }

                        })
                        navbarList+='</dl>'
                        navbarList+='</li>'
                    }
                }
            })
            $(".siderMain ul").html(navbarList)
            setCurrent()
            $(".slitIcon").on("click",function(event){
                var widths=$(".sider").width();
                var margin=parseInt($(".sider").css("margin-left"));
                if(margin==0){
                    $(".sider").css({"margin-left":"-"+widths+"px"});
                    $(".contentMain .container").css("width","100%")
                    $(".slitIcon").css("left","0px")
                }else{
                    $(".sider").css({"margin-left":"0px"});
                    $(".contentMain .container").css("width","calc(100% - 220px)")
                    $(".slitIcon").css("left",widths+"px")
                }

            })
        })
    })
})

function getcmsData(){
    ajaxFns({},function(res){
        if(res.data && res.data.length>0){
            var cmsData=res.data[0];
            var logovag=cmsData.logo?img_ipDress+cmsData.logo:"/uploads/default/logo.svg"
            $(".cms_name").html(cmsData.name)
            $(".header-brand img").attr("src",logovag).attr("alt","logo")
        }
    },ipDress+"/des/admin/systems")
}
function getCurrentUrl(){
    var url=currentUrl.replace(ipDress,"");
    if(url.indexOf("?")){
        url=url.split("?")[0]
    }
    if(url.lastIndexOf("/")==url.length-1){
        url=url.substring(0,url.lastIndexOf("/"))
    }
    return url
}


/***获取导航**/
function getNav(callBack){
    callBack=callBack?callBack:function(){};
    var newnavColumns=[];
    navColumns.map(function(obj){
        obj.chirld=checkNull(obj.chirld)?[]:obj.chirld;
        if(obj.chirld.length==0 && !checkNull(obj.link)){
            newnavColumns.push(obj.link)
        }
        if(obj.chirld.length>0){
            obj.chirld.map(function(objs){
                if(!checkNull(objs.link)){
                    newnavColumns.push(objs.link)
                }
            })
        }
    })
    newnavColumns=newnavColumns.length>0?newnavColumns.join(","):"";
    getpermissionData(newnavColumns, function(res){
        callBack(res)
    })
}

/* 为 navColumns导航栏添加权限字段*/
function navsGetpermission(navColumns, rest, callBack){
    
    var result=rest.result;
    var columnsresult=stringToArry(result);
    //设置权限
    navColumns.map(function(obj){
        if(obj.chirld.length==0 && !checkNull(obj.link)){  //没有下拉
            var link=removeNull(obj.link);
            if(indexof(columnsresult, link)){
                obj.permission=true;
            }else{
                obj.permission=false;
            }
        }
        if(obj.chirld.length>0){  //有下拉
            var listArry=[];
            obj.chirld.map(function(listObj){
                if(!checkNull(listObj.link)){
                    var link=listObj.link;
                    if(indexof(columnsresult, link)){
                        listObj.permission=true;
                        listArry.push(link)
                    }else{
                        listObj.permission=false;
                        
                    }
                }
            })
            obj.permission=listArry.length>0?true:false;
        }

    })
    
    
    
    callBack(navColumns)

}


function getCurrentUrl(){
    var url=currentUrl.replace(ipDress,"");
    if(url.indexOf("?")){
        url=url.split("?")[0]
    }
    if(url.lastIndexOf("/")==url.length-1){
        url=url.substring(0,url.lastIndexOf("/"))
    }
    return url
}
function dropdown(event){
    var e=window.event|| event
    e.preventDefault();
    var $this=$(e.currentTarget);
    var $parent=$(e.currentTarget).closest(".sider-item");
    
    var toggle_type=$this.hasClass("toggle_up")?"show":$this.hasClass("toggle_down")?"hide":"show";
    if(toggle_type=="show"){
        $parent.find("dl.dropdown-menus").slideUp()
        $this.attr("class","nav-link toggle_down")
    }
    if(toggle_type=="hide"){
        $parent.find("dl.dropdown-menus").slideDown()
        $this.attr("class","nav-link toggle_up")
    }
    
}

function setCurrent(){
    var $this=$(".siderMain ul").find(".ative").parents(".sider-item")
        $this.addClass("ative")
        if($this.hasClass("sider-item ")){
            
            


        }
}