const querystring = require('querystring')
const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')
const {get, set} = require('./src/db/redis')
// 获取cookie过期时间
const getCookieExpires =() =>{
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 *60 *1000))
    return d.toGMTString()
}
// session数据
// const SESSION_DATA = {}

const getPostData = (req)=>{
    const promise = new Promise((resolve, reject)=>{
        if(req.method !== 'POST') {
            resolve({})
            return
        } 
        if( req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk=>{
            postData += chunk.toString()
        })
        req.on('end', ()=>{
            if(!postData){
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 设置返回格式--JSON
    res.setHeader('Content-type', 'application/json')

    const url = req.url
    req.path = url.split('?')[0]
    
    // 处理post data======把post data 放在req.body里
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item=>{
        if(!item){ return }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    
    // 解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if(userId) {
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析session (使用redis)
    let needSetCookie = false
    let userId = req.cookie.userid
    // console.log(userId)
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化session
        set(userId, {})
    }
    // 获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData=>{
        if(sessionData == null){
            set(req.sessionId, {})
            // 设置session
            req.session = {}    // 最终目的
        } else {
            req.session = sessionData  // 最终目的
        }

        return getPostData(req)
    })
    .then(postData=>{
        req.body = postData

        // 处理blog路由
        // const blogData = handleBlogRouter(req, res)
        const blogResult = handleBlogRouter(req, res)
        if(blogResult){
            blogResult.then(blogData=>{
                    if(needSetCookie){
                        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }
                    res.end(JSON.stringify(blogData))
                }
            )
            return
        }
        
        const userResult = handleUserRouter(req,res)
        if(userResult){
            userResult.then(userData=>{
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }
        // 处理user路由
        // const userData = handleUserRouter(req, res)
        // if(userData){
        //     res.end(JSON.stringify(userData))
        //     return 
        // }

        // 未命中路由，返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 Not Found \n")
        res.end()
    })
    
}


module.exports = serverHandle

// process.env.NODE_ENV