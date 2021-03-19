const mysql = require('mysql')

// 创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'myblog'
})

con.connect()

//执行sql语句
const sql = 'select id,username from users;'
// 执行语句
con.query(sql, (err, result)=>{
    if(err){
        console.log(err)
        return
    } else {
        console.log(result)
    }
})
// 关闭连接
con.end()