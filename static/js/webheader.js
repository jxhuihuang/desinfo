var navData=[];
// 自适应高度

// querys();
$(window).resize(function(){ 
    
    ismobiles=body_widths>=768 || isMobile=="false"?false:true;
    setNav(navData)
});

$(".navbar-toggler").on("click",function(){
    navbarToggler()
})
var navColumns=[
    {
        name:"通知公告",
        link:"/article",
        mustLogin:false,
        children:[]
    },
    {
        name:"报告提交",
        children:[
            {
                name:'填报规范',
                mustLogin:true,
                link:'/report/standard'
            },
            {
                name:'在线上报',
                mustLogin:true,
                link:'/report/add'
            },
            {
                name:'报告列表',
                mustLogin:true,
                link:'/report'
            }
        ]
    },
    {
        name:"业务管理",
        children:
        [
            {
                name:'被邀请用户',
                mustLogin:true,
                link:'/user'
            },
            {
                name:'药品管理',
                mustLogin:true,
                link:'/drug'
            }
        ]

    },
    {
        name:"财务管理",
        children:
        [
            {
                name:'充值',
                mustLogin:true,
                link:'/user/recharge'
            },
            {
                name:'提现',
                mustLogin:true,
                link:'/user/withdraw'
            },
            {
                name:'财务记录',
                mustLogin:true,
                link:'/user/account/log'
            }
        ]

    },
    {
        name:'个人设置',
        children:
        [
            {
                name:'个人信息',
                mustLogin:true,
                link:'/user/profile'
            },{
                name:'重新认证',
                mustLogin:true,
                link:'/user/change'
            },
            {
                name:'银行信息',
                mustLogin:true,
                link:'/user/bank'
            }
        ]
    }
]
getNavData(function(res){
    setNav(navData)
});

/**设置导航**/
function setNav(res){
    var userInfo=JSON.parse(localStorage.getItem("userInfo"));
    var usernames=userInfo?userInfo.name:""
    var avatar="";
    if(userInfo){
        if(!userInfo.avatar || userInfo.avatar=="default.png"){
            avatar=img_ipDress+default_avatar
        }
        if(userInfo.avatar){
            avatar=img_ipDress+userInfo.avatar;
        }
    }
    
    var loginType=res.islogin;
    var ishaspermission=res.permission;
    navsGetpermission(navColumns, res, loginType, function(navColumns){
        var navbarList=''
        navbarList+='<ul class="navbar-nav">'
        navColumns.map(function(obj){
            var permission=obj.permission;
            var children=obj.children;
            if(permission){
                if(children.length<=0){
                    var link=checkNull(obj.link)?"javascript:void(0)":obj.link;
                    navbarList+='<li class="nav-item">'
                    navbarList+='<a class="nav-link " href="'+obj.link+'">'+obj.name+'</a>'
                    navbarList+='</li>'   
                }else{
                    navbarList+='<li class="nav-item dropdown">';
                    navbarList+='<a class="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+obj.name+'</a>';
                    navbarList+='<div class="dropdown-menu">'
                    children.map(function(objs){
                        if(objs.permission){
                            navbarList+='<a class="dropdown-item" href="'+objs.link+'">'+objs.name+'</a>'
                        }
                    })
                    navbarList+='</div>'
                    navbarList+='</li>'   
                }
            }
        })
        navbarList+='<li class="nav-item login-item">'
        navbarList+='<a class="nav-link  logout mobile-show" href="/">返回主页</a>'

        navbarList+=!loginType?'<a class="nav-link  logout" href="../../auth/login">登录</a>':"";
        navbarList+=!loginType?'<a class="nav-link  logout" href="../../auth/register">注册</a>':"";

        navbarList+=loginType?'<a class="nav-link  logout pc-show nav-username" href="javascript:void(0)"><span class="nav-avatar"><img src='+avatar+'></span><em>'+usernames+'</em></a>':"";
        navbarList+=loginType?'<a class="nav-link  logout" href="/auth/logout" onclick="loginOut(event)">登出</a>':"";
        navbarList+=' </li>'
        navbarList+= '</ul>'
        $("#navbarCollapses").html(navbarList)
    })

}

/**获取导航数据**/
function getNavData(callBack){
    callBack=callBack?callBack:function(){};
    var newnavColumns=[];
    navColumns.map(function(obj){
        obj.children=checkNull(obj.children)?[]:obj.children;
        if(obj.children.length==0 && !checkNull(obj.link)){
            newnavColumns.push(obj.link)
        }
        if(obj.children.length>0){
            obj.children.map(function(objs){
                if(!checkNull(objs.link)){
                    newnavColumns.push(objs.link)
                }
            })
        }
    })
    newnavColumns=newnavColumns.length>0?newnavColumns.join(","):"";
    getpermissionData(newnavColumns, function(res){
        now_permission=res.permission_list;
        navData=res;
        callBack(res)
    })
}

/* 为 navColumns导航栏添加权限字段*/
function navsGetpermission(navColumns, rest, loginType, callBack){
    
    var result=rest.result;
    var islogin=rest.islogin;
    var columnsresult=stringToArry(result);
    //设置权限
    navColumns.map(function(obj){
        if(!loginType){
            if(obj.children.length==0 && !checkNull(obj.link)){  //没有下拉
                var link=removeNull(obj.link);
                if(indexof(columnsresult, link) && !obj.mustLogin){
                    obj.permission=true;
                }else{
                    obj.permission=false;
                }
                
            }
            if(obj.children.length>0){  //有下拉
                var listArry=[];
                obj.children.map(function(listObj){
                    if(!checkNull(listObj.link)){
                        var link=listObj.link;
                        if(indexof(columnsresult, link) && !listObj.mustLogin){
                            listObj.permission=true;
                            listArry.push(link)
                        }else{
                            listObj.permission=false;
                            
                        }
                    }
                })
                obj.permission=listArry.length>0?true:false;
            }
        }
        if(loginType){
            if(obj.children.length==0 && !checkNull(obj.link)){  //没有下拉
                var link=removeNull(obj.link);
                if(indexof(columnsresult, link)){
                    obj.permission=true;
                }else{
                    obj.permission=false;
                }
                
            }
            if(obj.children.length>0){  //有下拉
                var listArry=[];
                obj.children.map(function(listObj){
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
        }
    })
    callBack(navColumns)

}

function loginOut(event){
    var e=window.event||event; //消除浏览器差异 
    e.preventDefault();
    ajaxFns({},function(res){
        if(res.resultCode=="0"){
            layermsg("用户登出成功",{time: 1000, icon: 1},function(){
                localStorage.removeItem("token");
                localStorage.removeItem("userInfo")
                location.reload();
            })
        }
    },ipDress+"/des/logout")
}
function querys(){
    ajaxFns({},function(res){
    },ipDress+"/des/querys")
}