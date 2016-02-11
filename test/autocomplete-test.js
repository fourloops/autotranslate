var tape = require('tape');
var hyper = require('hyperquest');
var shot = require('shot');
// var server = require('../src/server.js');
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

tape("autocomplete receives requests from server.js")
