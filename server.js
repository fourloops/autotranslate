var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 8000;

function handler(request, response){
    var url = request.url;
    if(url.length < 2){
        console.log(url.length,'length of url is ');
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile(__dirname + '/index.html', function(error, index){
        response.end(index);
        });
    }
    else {
        fs.readFile(__dirname + '/translate.js', function(error, js){
            response.end(js);
        });
    }
}

module.exports = {
    handler: handler
};

http.createServer(handler).listen(port);

console.log('node http is on localhost:' + port);
