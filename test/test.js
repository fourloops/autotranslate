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

tape("teardown", function(t){
    server.server.close();
    t.end();
});
