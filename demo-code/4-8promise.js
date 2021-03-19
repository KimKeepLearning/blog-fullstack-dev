const fs = require('fs') // 处理文件的
// const { resolve } = require('node:path')
const path = require('path')




// callback方式
// function getFileContent (filename, callback) {
//     const fullFilename = path.resolve(__dirname, 'files', filename)
//     fs.readFile(fullFilename, (err, data)=>{
//         if(err){
//             console.log(err)
//             return
//         }
//         callback(JSON.parse(data.toString()))
//     })
// }

// getFileContent('a.json', aData=> {
//     console.log(aData)
//     getFileContent('b.json', bData=>{
//         console.log(bData)
//         getFileContent('c.json', cData=>{
//             console.log(cData)
//         })
//     })
// })


// promise ---- 解决回调地狱
function getFileContent(filename){
    const promise = new Promise((resolve, reject)=>{
        const fullFilename = path.resolve(__dirname, 'files', filename)
        fs.readFile(fullFilename, (err, data)=>{
            if(err){
                reject(err)
                return
            }
            resolve(JSON.parse(data.toString()))
        })
    })  
    return promise
}

getFileContent('a.json').then(aData=>{
    console.log(aData)
    return getFileContent(aData.next)
}).then(bData=>{
    console.log(bData)
    return getFileContent(bData.next)
}).then(cData=>{
    console.log(cData)
})
