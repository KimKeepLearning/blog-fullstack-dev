const {login} = require('../controller/user')
const {SuccessModel, ErrorModel}  = require('../model/resModel')
const {set} = require('../db/redis')

const handleUserRouter = (req, res)=>{
    const method = req.method
    // 登录
    /*
        如果cookie中有登录信息，那就是登录了
        如果cookie中没有登录信息，那就是没登录
    */
    if(method === 'POST' && req.path === "/api/user/login"){
        const {username, password} = req.body
        // const {username, password} = req.query
        const result = login(username, password)
        return result.then(data => {
            if(data.username) {
                // 设置session
                req.session.username = data.username;
                req.session.realname = data.realname;
                // 同步到redis中
                set(req.sessionId, req.session)
                // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)

                return new SuccessModel()
            }
            return new ErrorModel('login failed')
        })
    }
    // 登录验证测试
    // if(method==="GET" && req.path==='/api/user/login-test'){
    //     if(req.session.username){ // 判断有没有登录
    //         return Promise.resolve(
    //             new SuccessModel({
    //                 username: req.session
    //             })
    //         )
    //     }
    //     return Promise.resolve(new ErrorModel("尚未登录"))
    // }
}

module.exports = handleUserRouter