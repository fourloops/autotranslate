require('env2')('./config.env');
var http = require("http");
var yandex = require('./yandex.js');
var fs = require("fs");
var autoComp = require("./autocomplete.js");

var port = process.env.PORT;

function handler(req, res) {
	var url = req.url;
	if (url.length === 1) {
		res.writeHead(200, {"Content-type": "text/html"});
		fs.readFile(__dirname.replace("/src", "") + '/index.html', function(err, data) {
			res.end(data);
		});
	} else if (url.indexOf("word=") > -1) {
		var responseText = autoComp.autocomplete(url).toString();
		res.writeHead(200, {"Content-type": "text/html"});
		res.end(responseText);
	} else if (url.indexOf("wordAndTrans=") > -1) {
		var responseJSON = autoComp.autotranslate(url);
		res.writeHead(200, {"Content-type": "text/html"});
		res.end(responseJSON);
	} else if(url.indexOf('def=') > -1){
		yandex.translate(url, function(translation){
	        res.writeHead(200, {"Content-type": "text/html"});
	        res.end(translation);
	    });
	} else {
		fs.readFile(__dirname.replace("/src", "") + url, function(error, file){
  			if (error) {
				res.writeHead(404, {'Content-Type' : 'text/'});
    			res.end('NOT FOUND!');
  			} else {
    			var ext = url.split('.')[1];
			    res.writeHead(200, {'Content-Type' : 'text/' + ext});
			    res.end(file);
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
