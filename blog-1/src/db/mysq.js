const mysql = require('mysql')

const {MYSQL_CONF} = require('../config/db')

// 创建连接
const con = mysql.createConnection(MYSQL_CONF)

con.connect()

// 执行sql的函数
function exec(sql){
    const promise = new Promise((resolve, reject)=>{
        con.query(sql, (err, result)=>{
            if(err){
                reject(err)
                return
            } else {
                resolve(result)
            }
        })
    })
    return promise
}

module.exports = {
    exec
}