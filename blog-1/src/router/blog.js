const {
    getList, 
    getDetail, 
    newBlog,
    updateBlog,
    delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

// 同意的登录验证函数
const loginCheck = (req)=>{
    if(!req.session.username){ // 判断有没有登录
         return Promise.resolve(new ErrorModel("尚未登录"))
    }
   
}


const handleBlogRouter = (req, res)=>{
    const method = req.method
    // const url = req.url
    // const path = url.split('?')[0]
    const id = req.query.id

    // 获取博客列表
    if(method === 'GET' && req.path==='/api/blog/list'){
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''

        if(req.query.isadmin){
            // 管理员界面 admin.html
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult){
                return loginCheckResult
            }
            author = req.session.username
        }

        const result = getList(author, keyword)
        // const listData = getList(author, keyword)
        return result.then(listData=>{
            // console.log(listData)
            return new SuccessModel(listData)
        })
        

    }

    // 获取博客详情
    if(method === 'GET' && req.path === '/api/blog/detail'){
        
        // const data = getDetail(id)

        // return new SuccessModel(data)
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }
    
    // 新建博客的接口
    if(method==='POST' && req.path==='/api/blog/new'){

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult){
            return loginCheckResult
        }

        // const author = 'zhangsan'
        req.body.author = req.session.username

        const result = newBlog(req.body)
        return result.then(data=>{
            return new SuccessModel(data)
        })

        // const blogData = req.body
        // const data = newBlog(blogData)
        // return new SuccessModel(data)
    }

    // 更新博客
    if(method === 'POST' && req.path === '/api/blog/update'){

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult){
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val=>{
            if(val) return new SuccessModel()
            else return new ErrorModel('update failed')
        })
        // if(result) {
        //     return new SuccessModel()
        // } else{
        //     return new ErrorModel('update failed')
        // }
        
    }
    // 删除博客
    if(method==='POST' && req.path === '/api/blog/del'){

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult){
            return loginCheckResult
        }

        const author = req.session.username

        const result = delBlog(id, author);
        return result.then(val=>{
            if(val) return new SuccessModel()
            else return new ErrorModel('delete failed')
        })
        
    }
}

module.exports = handleBlogRouter