var http = require("http");

var fs = require("fs");

var port = process.env.PORT || 4000;

function handler(request, response){
	var url = request.url;
	if(url.length === 1){
		response.writeHead(200, {"Content-type": "text/html"});
		fs.readFile(__dirname + '/index.html', function(err, data) {
			if(err) throw err;
			response.end(data);
		});
	}
	else if(url.indexOf("word=") > -1){
		response.writeHead(200, {"Content-type": "text/html"});
		response.end(url.split("word=")[1]);
	}
	else{
		fs.readFile(__dirname + url, function(error, file){
  			if (error){
    			console.log(error);
    			response.end();
  			} else {
    			var ext = url.split('.')[1];
			    response.writeHead(200, {'Content-Type' : 'text/' + ext});
			    response.end(file);
  			}
		});
	}
}

var server = http.createServer(handler);

module.exports = {
	handler: handler,
	server: server
};

server.listen(port);

console.log("Local host at " + port);