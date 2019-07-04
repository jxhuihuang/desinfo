
const crypto = require("crypto");
const {random, Base64}=require("./untils")  //引入生成随机数的、baset64加密的
let base64 = new Base64();
function encodes(password){
    //1.生成8位的随机数
    let randomWord = random(false,8);
    let base64 = new Base64();
    //2.对生成的随机数加密
    let base64Random = base64.encode(randomWord);
    //3.将第二步的值与密码拼接
    let newPas = base64Random + password;
    let md5 = crypto.createHash("md5");
    //4.将第三步的进行md5加密
    let md5Pas = md5.update(newPas).digest("hex");
    //5.将第四步进行base64加密
    let base64Md5 = base64.encode(md5Pas);
    //6.将第二步与第五步拼接
    let lastPasswords = base64Random + base64Md5;
    return lastPasswords;
}

//密码解密
function unencodes(params_password,password){
    let base64Random =password.substring(0,11);
    //2.将第一步的结果与用户输入的密码拼接
    let newPas = base64Random + params_password;
    //3.将第二步的结果进行MD5加密
    let md5 = crypto.createHash("md5");
    let md5Pas = md5.update(newPas).digest("hex");
    //4.将第三步进行base64加密
    let base64Md5 = base64.encode(md5Pas);
    //5.将第一步与第四步拼接
    let lastPasswords = base64Random + base64Md5;
    return lastPasswords;
}

module.exports = {
    encodes:encodes,
    unencodes: unencodes,
}
