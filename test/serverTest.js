var test = require('tape');
var hyperquest = require('hyperquest');
var server = require('../server.js');
var fs = require('fs');

test('Does server respond?', function(t) {
    hyperquest('http://localhost:4000', function(err, res) {
        //   console.log(res);
        t.equal(res.statusCode, 200);
        t.end();
    });
});

test("Does server return html page for index?", function(t){
	hyperquest('http://localhost:4000', function(err, res){
		var data = '';
		res.on('data', function(chunk){
			data += chunk;
		});
		res.on('end', function(){
			t.notEqual(data.indexOf("<!DOCTYPE html>"),-1);
			t.end();
		});
	});
});

test("Does server return complete index.html page?", function(t){
	hyperquest('http://localhost:4000', function(err, res){
		var data = '';
		res.on('data', function(chunk){
			data += chunk;
		});
		res.on('end', function(){
			fs.readFile(__dirname + '/../index.html', function(err, indexText) {
				t.notEqual(data, indexText);
                t.end();
    		});
		});
	});


});

test("Does server return 404 and 'Not found' for unknown URL?", function(t){
	hyperquest('http://localhost:4000/unknownURL8439', function(err, res){
		t.equal(res.statusCode, 404);
        t.end();
	})
})


test("If URL contains 'word=', server should return anything after the '='", function(t){
	hyperquest('http://localhost:4000/word=blah', function(err, res){
		var data = '';
		res.on('data', function(chunk){
			data += chunk;
		});
		res.on('end', function(){
			t.equal(data, 'blah');
			t.end();
		});
	});
});

test("teardown", function(t){
    server.server.close();
    t.end();
});