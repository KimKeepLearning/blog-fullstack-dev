const http = require('http')
const querystring = require('querystring')

var server = http.createServer((req, res)=>{
    console.log(req.method)
    var url = req.url
    req.query = querystring.parse(url.split('?')[1])
    res.end(JSON.stringify(req.query))
})

server.listen(8000)
