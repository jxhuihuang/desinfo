## node.js环境下express+mysql的服务端项目




## 进入项目根目录


`npm install`





## 进入/config/mysql.js，配置数据库设置


```
mysql = {

        host: "xx.xxx.xxx.xxx", //这是数据库的地址

        user: "xxx", //需要用户的名字

        password: "xxx", //用户密码 ，如果你没有密码，直接双引号就是

        database: "xxx" //数据库名字

    } //好了，这样我们就能连接数据库了



module.exports = mysql; //用module.exports暴露出这个接口，
```

## 运行项目
`npm start`




##错误代码 

10  用户名密码错误

11  用户名不存在

12  用户还在审核中

13  用户过期

14  用户权限不足 

15  用户没有登录权限

16  字段值只能唯一

500 查询错误
