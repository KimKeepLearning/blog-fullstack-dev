const path = require('path')
const fs = require('fs')
// linux 标准输入输出
// process.stdin.pipe(process.stdout)
/*   源水桶    管子     目标水桶   */

// const http = require('http')

// const server = http.createServer((req, res)=>{
//     if(req.method='POST'){
//         req.pipe(res)
//     }
// })
// server.listen(5000 )

// 复制文件
const filename1 = path.resolve(__dirname, './data.txt')
const filenmae2 = path.resolve(__dirname, './target.txt')

const stream = fs.createReadStream(filename1)
const tstream = fs.createWriteStream(filenmae2)

stream.pipe(tstream)
stream.on('data', chunk => {
    console.log(chunk.toString())
    console.log("*******")
})
stream.on('end',()=>{
    console.log("copy completed")
})