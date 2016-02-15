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
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/word=extr'}, function(res){
        var actual = res.payload;
        var expected = 'extra,extrabold,extrabranchial,extrabronchial,extrabuccal,extrabulbar,extrabureau,extraburghal,extracalendar,extracalicular';
        t.deepEqual(actual, expected, "server calls the autocomplete function and responds with the expected array");
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

// -------- AUTOCOMPLETE TESTS ----------- //

tape('autocomplete should read "words.txt" file and save it with the correct number of lines',function(t){
    var linesInFile = auto.words.length;
    var expected    = 235887;
    t.equals(linesInFile,expected,"words.txt has correct number of lines");
    t.end();
});

tape('autocomplete should have the correct content',function(t){
    var actual1     = auto.words[0];
    var expected1   = "A";
    t.equals(actual1,expected1,"words.txt has the correct 1st word");

    var actual2     = auto.words[auto.words.length - 2];
    var expected2   = "Zyzzogeton";
    t.equals(actual2,expected2,"words.txt has the correct last word");

    var actual3     = auto.words[129197];
    var expected3   = "Observantine";
    t.equals(actual3,expected3,"words.txt has the correct middle word");
    t.end();
});

tape("autocomplete receives requests from server.js", function(t){
    shot.inject(server.handler, {method: 'GET', url:'/'}, function(res) {
        t.equal(res.statusCode, 200, 'Success!');
        t.end();
    });
});

tape('autocomplete returns an array with the first results of a 4-letter query (maximum 10)',function(t){
    var actual = auto.autocomplete( 'airp' );
    var expected = ['airpark', 'airphobia', 'airplane', 'airplanist', 'airport', 'airproof'];
    t.deepEqual(actual, expected,'query words for input "airp"');
    t.end();
});

tape('returned array should include only words that start with the input', function(t){
    var actual = auto.autocomplete( 'bana' );
    var expected = ['bana', 'banaba', 'banago', 'banak', 'banakite', 'banal', 'banality', 'banally', 'banana', 'bananaland'];
    t.deepEqual(actual, expected, '"bana" input excludes word "arabana"');
    t.end();
});

tape('returned array should be case-insensitive', function(t){
    var actual = auto.autocomplete( 'gran' );
    var expected = ['granada', 'granadilla', 'granadillo', 'granadine', 'granage', 'granary', 'granate', 'granatum', 'granch', 'grand'];
    t.deepEqual(actual, expected, '"gran" input returns granadine (Granadine in the txt file). ');
    t.end();
});

tape('user input matches words in wods.txt even if it includes capital letters', function(t){
    var actual = auto.autocomplete( 'Bump' );
    var expected = ['bump', 'bumpee', 'bumper', 'bumperette', 'bumpily', 'bumpiness', 'bumping', 'bumpingly', 'bumpkin', 'bumpkinet'];
    t.deepEqual(actual, expected, '"Bump" input still returns an array of ten words');
    t.end();
});

tape('time taken by the function should be less than 0.5s for ',function(t){
    var tStart  = new Date().getTime();
    var result = auto.autocomplete('unpa');
    var tEnd    = new Date().getTime();
    var timeTaken = tEnd - tStart;
    console.log(timeTaken);
    t.ok(timeTaken < 500, 'autocomplete worst case takes less than 1s');
    t.end();
});


// -------- WORDNIK DEFINITION TESTS ----------- //

tape('server should respond to the "def=" url and provide a stringified object with corresponding text and partOfSpeech upon calling the definitionGetter function', function(t){
    shot.inject(server.handler, {method: 'GET', url: 'http://localhost:4000/def=mobile'}, function(res) {
        var defResp = res.payload.split('\n')[0];
        t.equal(res.statusCode, 200, 'server provides a successful response');
        t.equal(defResp, '{"text":"Capable of moving or of being moved readily from place to place:  a mobile organism; a mobile missile system. ","partOfSpeech":"adjective"}', "it's a perfect match!");
        t.end();
    });
});

// -------- PIXABAY URL-GETTER TESTS ----------- //
tape('server should respond to the "def="url and provide a string-type url upon calling the pixabayGetter function. The respons',function(t){
    shot.inject(server.handler, {method:"GET", url: 'http://localhost:4000/def=stunned'}, function(res){
        var imgURLResp = res.payload.split('\n')[1];
        t.equal(res.statusCode, 200,'server provides a successful response');
        t.equal(typeof imgURLResp, "string", "provides a string as a response");
        t.ok( actual.match( /.jpg$/ ) , "aren't you stunned this works?");
        t.ok( actual.indexOf( 'https://pixabay.com/get/' ) > -1, 'result gets image URL using pixabay API');
        t.end();
    });
});

// -------- EXIT SERVER ----------- //

tape("teardown", function(t){
    server.server.close();
    t.end();
});
