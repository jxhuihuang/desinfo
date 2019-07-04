var express = require('express');
let {getNowFormatDate, checkNull}=require('../../common/untils');
var multer = require("multer");
var router = express.Router();

var datatime = './public/uploads/'+getNowFormatDate();

// 设置图片存储路径
var storage = multer.diskStorage({
    destination: datatime,
    // function(req, file, cb) {
    //     cb(null,  datatime);
    // },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// 添加配置文件到muler对象。
var upload = multer({ storage: storage });
// var imgBaseUrl = '../'

router.post('/', upload.array('file', 10), function (req, res) {
    // 读取上传的图片信息
    var files = req.files;
    // 设置返回结果
    var result = {};
    if(!files[0]) {
        res.json({
            code: '200',
            resultCode:"28",
            success:"false",
            resultMsg:"上传失败"
        })
    } else {
        var arr = [];
        for(var i in req.files){
            arr.push(req.files[i].path);
        }
        res.json({
            code: '200',
            data: req.files
        })
        // result.errMsg = '上传成功';
    }
    
  });
  
module.exports = router;