var tape = require('tape');
var shot = require('shot');
var server = require('../src/server.js');
var auto = require('../src/autocomplete.js');
var fs = require('fs');

// ----------- SERVER TESTS -------------

tape('Does server respond successfully?', function(t) {
    shot.inject(server.handler, {method: 'GET', url:'/'}, function(res) {
        t.equal(res.statusCode, 200, 'Server responds!');
        t.end();
    });
});

tape("Does server return html page for index?", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000'}, function(res){
        t.notEqual(res.payload.indexOf("<!DOCTYPE html>"), -1, 'server returns html page');
        t.end();
    });
});

tape("Does server return complete index.html page?", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000'}, function(res){
        fs.readFile(__dirname.replace("/test", "") + '/index.html', function(err, indexText) {
            t.equal(res.payload, indexText.toString(), 'server returns index page');
            t.end();
        });
    });
});

tape("Does server return css or javascript pages", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/style.css'}, function(res){
        fs.readFile(__dirname.replace("/test", "") + '/style.css', function(err, cssText) {
            t.equal(res.payload, cssText.toString(), 'server returns css page');
            t.end();
        });
    });
});

tape("Does server return 404 and 'Not found' for unknown URL?", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/unknownURL8439'}, function(res){
        t.equal(res.statusCode, 404, "server returns 404");
        t.end();
    });
});


tape("Server responds with a maximum array of 10 words from a minimum 4-character user input", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/word=extr&lang=de'}, function(res){
        var actual = [];
        var result = JSON.parse(res.payload);
        for(var i=0;i<10;i++){
            actual.push(result.results[i][0]);
        }
        var expected = [ 'extra-Christian', 'extra-constitutional', 'extra-curricular', 'extra-European', 'extra-familial', 'extra-fine', 'extra-judicial', 'extra-large', 'extra-liturgical', 'extra-long' ];
        t.deepEqual(actual, expected, '"extra" returns 10 words beginning with extra');
        t.end();
    });
});

tape("Server responds to request with correct translated words in German", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/word=extr&lang=de'}, function(res){
        var actual = [];
        var result = JSON.parse(res.payload);
        for(var i=0;i<10;i++){
            actual.push(result.results[i][1]);
        }
        var expected = [ 'außerchristlich', 'außerkonstitutionell', 'außerhalb des Lehrplans ', 'außereuropäisch', 'außerfamiliär', 'extrafein', 'außergerichtlich', 'extragroß', 'außerliturgisch', 'extralang' ];
        t.deepEqual(actual, expected, '"extra" returns 10 correct German words');
        t.end();
    });
});

// -------- AUTOCOMPLETE TESTS ----------- //



// -------- WORDNIK DEFINITION TESTS ----------- //

tape('server should respond to the "def=" url and provide a stringified object with corresponding text and partOfSpeech upon calling the definitionGetter function', function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/def=mobile'}, function(res) {
        var defResp = res.payload.split('\n')[0];
        t.equal(res.statusCode, 200, 'server provides a successful response');
        t.equal(defResp, '{"definition":"Capable of moving or of being moved readily from place to place:  a mobile organism; a mobile missile system. ","partOfSpeech":"adjective"}', "it's a perfect match!");
        t.end();
    });
});

// -------- PIXABAY URL-GETTER TESTS ----------- //
tape('server should respond to the "def=" url and provide a string-type url upon calling the pixabayGetter function.',function(t){
    shot.inject(server.handler, {method:"GET", url: 'http://localhost:4000/def=dog'}, function(res){
        var imgURLResp = res.payload.split('\n')[1];
        t.equal(res.statusCode, 200,'server provides a successful response');
        t.equal(typeof imgURLResp, "string", "provides a string as a response");
        t.ok(  imgURLResp.match( /.jpg$/ ) , "aren't you stunned this works?");
        t.ok(  imgURLResp.indexOf( 'https://pixabay.com/get/' ) > -1, 'result gets image URL using pixabay API');
        t.end();
    });
});

// -------- EXIT SERVER ----------- //

tape("teardown", function(t){
    server.server.close();
    t.end();
});
