var http = require("http");

var fs = require("fs");
var autoComp = require("./autocomplete.js")

var port = process.env.PORT || 4000;

function handler(request, response){
	var url = request.url;
	if(url.length === 1){
		response.writeHead(200, {"Content-type": "text/html"});
		fs.readFile(__dirname.replace("/src", "") + '/index.html', function(err, data) {
			if(err) throw err;
			response.end(data);
		});
	}
	else if(url.indexOf("word=") > -1){
		var inputText = url.replace("word=","");
		response.writeHead(200, {"Content-type": "text/html"});
		response.end( autoComp.autocomplete( inputText ).toString() );
	}
	else{
		response.writeHead(404, {"Content-type": "text/html"});
		response.end("Not found");
	}
}

var server = http.createServer(handler);

module.exports = {
	handler: handler,
	server: server
};

server.listen(port);

console.log("Local host at " + port);
