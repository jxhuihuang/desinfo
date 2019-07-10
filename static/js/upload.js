!
function(t,s){
    s={};
    var photoArry=[]
    var fileObj={}
    /*****初始化上传 */
   
    /***处理参数 */
    function uploadzeparams(params,$this){
        params.onChanges=params.onChanges?params.onChanges:function(){};
        var defaultParams={
            types:$this.attr("data-type")?$this.attr("data-type"):"default", //显示方式
            defaultData:"",
            accept:"images",  //images
            multiple:false,
            text:"",
            ipDress:"",
            showImg:true,
            className:"",
        }
        var settings = {};

        $.extend(settings,defaultParams,params);
        var newparams={}
        newparams.types=settings.types;
        newparams.defaultData=settings.defaultData;
        newparams.accept=settings.accept;
        newparams.multiple=settings.multiple;
        newparams.text=settings.text;
        newparams.ipDress=settings.ipDress;
        newparams.showImg=settings.showImg;
        params.defaultData=removeNull(params.defaultData)
        newparams.className=settings.className;
        return newparams;
    }
    
    t.fn.uploadze=function(params){
        var $this=$(this);
        
        var file_input=$this.parent().find("input[type=file]")
        var newinput=file_input.clone(true, true);
        var file_name=$this.attr("name")
        var newparams=uploadzeparams(params,$this)
        var className=newparams.className!=""?" "+newparams.className:"";
        newinput.attr("hidden",false)
        // newinput.attr("onchange","fileChange(event)")
        var $parent=$this.parent();
        var imgaccept="image/gif, image/jpeg, image/png"
        if(newparams.accept){
            
            if(newparams.accept=="images"){
                newinput.attr("accept",imgaccept)
                newinput.attr("data-accepttype","images")
            }
            
        }
        if(newparams.multiple){
            newinput.attr("multiple",true)
        }
        
        var defaultDatas=[]
        if(newparams.defaultData && newparams.defaultData!=""){
            // fileObj[file_name]
            var defaultDataArry=Array.isArray(newparams.defaultData)?newparams.defaultData:stringToArry(newparams.defaultData);
            if(defaultDataArry.length>0){
                defaultDataArry.map(function(obj){
                    if(!checkNull(obj)){
                        var paths=obj;
                        var names=obj.substring(obj.lastIndexOf("/")+1,obj.length);

                        defaultDatas.push({filename:names,path:paths,src:newparams.ipDress?newparams.ipDress+paths:paths})
                        
                    }
                })
            }
            fileObj[file_name]=defaultDatas;
        }
        
        if(newparams.types=="avatar"){
            $parent.html(

            `
                <div class="uploads uploads_avatar${className}">+
                    <a class="upload-box " href="javascript:void(0)">
                        ${
                            newparams.showImg?`<span class="upload-show "></span>`:""
                        }
                        
                        <!-- <button type="button"><i class="myIconfont">&#xe620;</i>立即上传</button>  -->
                        ${
                            newparams.text!=""?`<div class="uppoad_placeholder"> <span>${newparams.text}</span> </div> `:`<div class="uppoad_placeholder"><span> <i class="myIconfont" style="font-size:40px;color:#666">&#xe832;</i> </span> </div> `
                        }
                        
                    </a>
                </div>
            `
            )
            if(newparams.showImg){
                defaultDatas.map(function(obj){
                    $parent.find(".upload-show").append(
                        `<figure><img  class="avatar_img " src="${obj.src}"/></figure>`
                    )
                })
            }
            
            $parent.find(".upload-box ").append(newinput)
            
        }else{
            $parent.html(
            `
                <div class="uploads uploads_buttom${className}">
                    ${
                        newparams.showImg?`<span class="upload-show "></span>`:""
                    }
                    <a class="upload-box" href="javascript:viod(0)">
                    
                        <button type="button"><i class="myIconfont">&#xe620;</i>立即上传</button> 
                       
                    </a>
                    
                </div>
            `
            )
            if(newparams.showImg){
                defaultDatas.map(function(obj){
                    $parent.find(".upload-show").append(
                        `
                        <figure><img  class="avatar_img " src="${obj.src}"/> ${newparams.multiple?`<i class="myIconfont closeIcon" >&#xe925;</i>`:""}</figure>
                        `
                    )
                    
                })
            }
            $parent.find(".upload-box ").append(newinput)
        } 
        

        $parent.delegate('.closeIcon', 'click', function() {
            var $this=$(this).closest("figure")
            var name=$(this).closest(".uploads").find("input[type='file']").attr("name");
           
            var path=$this.find("img").attr("src");
            var src=path.substring(path.lastIndexOf("/")+1,path.length);
            if(fileObj[name]){
                var newArry=[]
                fileObj[name].map(function(obj){
                    if(obj.filename!=src){
                        newArry.push(obj)
                    }
                })
                fileObj[name]=newArry;
            }else{
                fileObj[name]=[]
            }
            $this.remove()
            params.onChanges(fileObj[name])
        })
        newinput.on('change', function (event) {
            fileChange(event,function(photoArry,elem){
                params.onChanges(photoArry,elem)
            })
        })

    }
    
    /********显示上传的图片 */
    function uploadShowimg($this,imgArry){
        var ismMultiple=$this.closest(".uploads").find("input[type='file']").attr("multiple")=="multiple"?true:false
        imgArry.map(function(objs){
            var src="";
            if(objs.src){
                src=objs.src
            }else{
                src=objs.path?ipDress+objs.path:""
            }
            var name=objs.name;
            var fileType=objs.fileType
            if(ismMultiple){
                $this.closest(".uploads").find(".upload-show").append('<figure><img src="'+src+'" class="img-fluid"><i class="myIconfont closeIcon">&#xe925;</i></figure>')
            }else{
                if($this.closest(".uploads").find(".upload-show").find("img").length>0){
                    $this.closest(".uploads").find(".upload-show img").attr("src", src)
                }else{
                    $this.closest(".uploads").find(".upload-show").html('<figure><img src="'+src+'" class="img-fluid"></figure>')
                }
                
            }
            
        })
    }
    function checkfile(file,event,callBack){
        callBack=callBack?callBack:function(){};
        var e=window.event|| event
        var $this=$(e.currentTarget);

        var imgaccep="gif|jpg|jpeg|png|bmp|svg" //图片允许的格式
        var filesaccep="docx|doc|txt|rar|zip|xls|xlsx|ppt|pptx"  //文件格式
        
        var allaccep=imgaccep+"|"+filesaccep;
        var imgstrP=eval("/.("+imgaccep+")$/");
        var filestrP=eval("/.("+filesaccep+")$/");
        var allstrP=eval("/.("+allaccep+")$/");
        var myfilesObj=e.currentTarget.files  //e.currentTarget.files[0]
        var files=dealparams(myfilesObj)
        var accepttype=removeNull($this.attr("data-accepttype"));
        var checkText=""
        files.map(function(obj,i){
            if(!isNaN(i)){
                var  value = obj.name;
                if(!checkNull(value)){
                    if(accepttype=="images" && !imgstrP.test(value)){
                        checkText="请选择正确的图片格式"
                    }
                    if(accepttype=="file" && !filestrP.test(value)){
                        checkText="上传文件格式不正确"        
                    }
                    if(accepttype!="images" && accepttype!="file"){
                        if(!allstrP.test(value)){
                            checkText="上传文件格式不正确"
                        }
                    }
                }
            }
        })
        return checkText
    }
    /**选择上传的图片 */
    function selectImg(event,callback){
        callback=callback?callback:function(){};
        var e=window.event|| event
        var $this=$(e.currentTarget);
        var fileId=$this.attr("id");
        var imgArry=[];
        var file = document.getElementById(fileId);
        var accepttype=removeNull($this.attr("data-accepttype"));
        var value=file.value?(file.value).toLowerCase():"";
        var checkText= checkfile(file,event)
        if(checkText!=""){
            layermsg(checkText,{icon:2})
            return false;
        }
        if(window.FileReader){//chrome,firefox7+,opera,IE10+
            var myfilesObj=e.currentTarget.files  //e.currentTarget.files[0]
            if(myfilesObj){
                var myfilesArry=dealparams(myfilesObj)
                myfilesArry.map(function(obj,i){
                    if(!isNaN(i)){
                        var myfiles=obj;
                        var imgObj={};
                        imgObj.name = myfiles.name;
                        imgObj.size = myfiles.size;    //读取选中文件的大小
                        imgObj.type = myfiles.type;
                        imgObj.fileType=(myfiles.type).indexOf("image")>=0?"image":"files";
                        oFReader = new FileReader();
                        oFReader.readAsDataURL(file.files[i]);
                        oFReader.onload = function (oFREvent) {
                            imgObj.src = oFREvent.target.result;
                            imgArry.push(imgObj)
                            if(i==myfilesArry.length-1){
                                callback(imgArry,event)
                            }
                            // uploadShowimg($this,imgArry)
                        };      
                    }
                })

            }
        }
        else if (document.all) {//IE9-//IE使用滤镜，实际测试IE6设置src为物理路径发布网站通过http协议访问时还是没有办法加载图片
            file.select();
            file.blur();//要添加这句，要不会报拒绝访问错误（IE9或者用ie9+默认ie8-都会报错，实际的IE8-不会报错）
            var reallocalpath = document.selection.createRange().text//IE下获取实际的本地文件路径
            //if (window.ie6) pic.src = reallocalpath; //IE6浏览器设置img的src为本地路径可以直接显示图片
            //else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
                imgObj.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
                imgObj.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
                // uploadShowimg($this,imgArry)
                callback(imgObj,event)
        // }
        }
        else if (file.files) {//firefox6-
            if (file.files.item(0)) {
                url = file.files.item(0).getAsDataURL();
                imgObj.src = url;
                // uploadShowimg($this,imgArry)
                callback(imgObj,event)
            }
        }
    }
    /*****上传图片 */
    function uploadImg(elem,callBack){
        callBack=callBack?callBack:function(){};
        var e=window.event|| event
        var $this=elem
        var fileId=$this.attr("id");
        var file = document.getElementById(fileId)
        
        // file.files.length 上传数量
        var formData = new FormData();
        for(var i in file.files){//这里如果单张上传就不必遍历直接formData.append('file',file.files[0])
            formData.append('file',file.files[i]);
        }
        
        ajaxFns(formData,function(res){
            if(res.code==="200"  ){
                layermsg("上传成功！")
                var resdatas=res.data;
                resdatas.map(function(objs){
                    var destination=objs.destination?(objs.destination).replace("./public",""):""
                    objs.path=destination+"/"+objs.filename;
                })
                callBack(resdatas)
            } else {
                layermsg("上传失败！",{icon:2})
            }
            
        },'/des/upload',{cache:false,contentType:false,processData:false,isparse:false,})
    }

    function fileChange(event,callBack){
        var e=window.event|| event
        var $this=$(e.currentTarget);
        var name=$this.attr("name")
        var ismMultiple=$this.attr("multiple")=="multiple"?true:false
        selectImg(event,function(imgArry,event){
            uploadImg($this,function(imgArrys){
                uploadShowimg($this,imgArrys)
                if(name){
                    if(ismMultiple){
                        fileObj[name]=fileObj[name]?fileObj[name]:[]
                        fileObj[name]=fileObj[name].concat(imgArrys)
                       
                    }else{
                        fileObj[name]=imgArrys
                       
                    }
                    
                }
                callBack(fileObj[name],$this)
                
            })
        })
    }
    /****字符串转数组 */
    function stringToArry(strings){
        if(checkNull(strings)) return [];
        strings=strings.toString();
        
        if(strings.indexOf(",")==-1) {
            var stringsArry=[]
            stringsArry.push(strings)
            return stringsArry;
        }
        var stringsArry=[]
        strings=strings.lastIndexOf(",")==strings.length-1?strings.substring(0,strings.lastIndexOf(",")):strings;
        for(var i=0; i<strings.split(",").length;i++){
            stringsArry.push(removeNull(strings.split(",")[i]))
        }
        var nerArry=[];
        stringsArry.map(function(obj){
            if(nerArry.indexOf(obj)=="-1"){
                nerArry.push(obj)
            }
        })
        return nerArry
    }
   
}(jQuery, window, document)


/*******
 * types：显示方式  avatar 头像上传
 * accept:"images" 指定允许上传时校验的文件类型，可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）   默认images
 * defaultData :   默认值
 * ismMultiple 是否多选
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */