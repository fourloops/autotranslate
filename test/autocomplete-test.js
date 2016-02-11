var tape = require('tape');
var hyper = require('hyperquest');
var shot = require('shot');
var server = require('../src/server.js');
var auto = require('../src/autocomplete.js');
var fs = require('fs');


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

    var actual2     = auto.words[auto.words.length-2];
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
    var expected = ['bump', 'bumpee', 'bumper', 'bumperette', 'bumpily', 'bumpiness', 'bumping', 'bumpingly', 'bumpkin', 'bumpkinet']
    t.deepEqual(actual, expected, '"Bump" input still returns an array of ten words');
    t.end();
});

tape('time taken by the function should be less than 0.5s for ',function(t){
    var tStart  = new Date().getTime();
    var result = auto.autocomplete('unpa');
    var tEnd    = new Date().getTime();
    var timeTaken = tEnd-tStart;
    console.log(result);
    console.log(timeTaken);
    t.ok(timeTaken < 500, 'autocomplete worst case takes less than 1s');
    t.end();
});
