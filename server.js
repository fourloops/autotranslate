var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 8000;

function handler(request, response){
    response.writeHead(200,{"Content-Type":"text/html"});
    fs.readFile(__dirname + '/index.html', function(error, index){
      response.end(index);
    });
}

module.exports = {
    handler: handler
};

http.createServer(handler).listen(port);

console.log('node http is on localhost:' + port);
