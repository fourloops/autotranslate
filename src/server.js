require('env2')('./config.env');
var http = require("http");
var fs = require("fs");
var autoComp = require("./autocomplete.js");
var define	= require('./define.js');
var pictures = require('./pixabay.js');


var port = process.env.PORT || 4000;

function handler(req, res) {
	var url = req.url;
	if (url.length === 1) {
		res.writeHead(200, {"Content-type": "text/html"});
		fs.readFile(__dirname.replace("/src", "") + '/index.html', function(err, data) {
			res.end(data);
		});
	} else if (url.indexOf("word=") > -1) {
		var responseJSON = autoComp.autotranslate(url);
		res.writeHead(200, {"Content-type": "text/html"});
		res.end(responseJSON);
	} else if(url.indexOf('def=') > -1){
		var term = url.split('def=')[1].split('&')[0];
		res.writeHead( 200, { "Content-type": "text/html" } );

		var counter = 0;
		var def = '';
		define.definitionGetter( term, function( apiResp ){
			def += define.definitionFilter( apiResp );
			counter++;
			if (counter === 2) { res.end(def + '\n' + img); }
		});
		var img = '';
		pictures.pixabayGetter( term, function ( imgApiResp ){
			img += pictures.imgURLGetter( imgApiResp );
			counter++;
			if (counter === 2) { res.end(def + '\n' + img); }
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
