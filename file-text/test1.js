const fs = require('fs');
const { exists } = require('node:fs');
const path = require('path')

// 绝对路径
const filename = path.resolve(__dirname, './data.txt')

// 读取文件内容
// fs.readFile(filename, (err, data)=>{
//     if(err){
//         console.error(err);
//         return
//     }
//     // data是二进制类型
//     console.log(data)
//     console.log(data.toString())
// })


// 写入文件
// const content = '\nnew content\n'
// const opt = {
//     flag: 'a' // 追加
// }
// fs.writeFile(filename, content, opt, (err)=>{
//     if(err){
//         console.error(err);
//     }
// })

// 判断文件是否存在
fs.exists(filename, (exist)=>{
    console.log(exist)
})