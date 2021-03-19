const {exec} = require('../db/mysq')

const getList = (auth, keyword)=> {
    let sql = `select * from blogs where 1=1 `
    if(auth){
        sql += `and author='${auth}'`
    }
    if(keyword){
        sql += `and title='${keyword}'`
    }
    sql += ` order by createtime desc`

    // 返回的是promise对象
    return exec(sql)
}

const getDetail = (id)=>{
     // 先返回假数据，保证格式正确
     const sql = `select * from blogs where id='${id}'`
     return exec(sql).then(rows=>{
         return rows[0]
     })
}

const newBlog = (blogData = {}) => {
    // blogdata是博客对象
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()

    const sql = `insert into blogs (title, content, createtime, author) 
    values ('${title}','${content}',${createtime},'${author}');`

    return exec(sql).then(inserData=>{
        return {
            id: inserData.insertId
        }
    })
}
const updateBlog = (id, blogData ={})=>{

    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title = '${title}', content='${content}' 
        where id=${id}
    `

    return exec(sql).then(updateData=>{
        return updateData.affectedRows > 0
    })
}

const delBlog = (id, author) =>{
    const sql = `
        delete from blogs
        where id=${id} and author='${author}';
    `

    return exec(sql).then(deleteData=>{
        return deleteData.affectedRows > 0
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}