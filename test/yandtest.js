var tape = require('tape');
var shot = require('shot');
var yandex = require('../src/yandex.js');
var fs = require('fs');
var hyperquest = require('hyperquest');
var server = require('../src/server.js');

tape('Can translate successfully request and receive a translation in German?', function(t) {
    var infoInTest;
    yandex.translate('def=hello&lang=de', function(word){
        infoInTest = word;
        t.equal(infoInTest, 'Hallo', 'Correct German response received!');
        t.end();
    });
});

tape('Can translate successfully request and receive a translation in Spanish?', function(t) {
    var infoInTest;
    yandex.translate('def=hello&lang=es', function(word){
        infoInTest = word;
        t.equal(infoInTest, 'saludar', 'Correct Spanish response received!');
        t.end();
    });
});

tape("Server responds to 'translation' request with correct translated word", function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/def=hello&lang=de'}, function(res){
        var actual = res.payload;
        var expected = 'Hallo';
        t.equal(actual, expected, "server returns expected German word");
        t.end();
    });
});

tape("teardown", function(t){
    server.server.close();
    t.end();
});
