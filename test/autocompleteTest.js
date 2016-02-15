var tape = require('tape');
var shot = require('shot');
var auto = require('../src/autocomplete.js');
var fs = require('fs');

// -------- AUTOCOMPLETE TESTS ----------- //

tape('autocomplete should read "wordsDE.txt" file and save it with the correct number of lines',function(t){
    var linesInFile = auto.wordsDE.length;
    var expected    = 264727;
    t.equals(linesInFile,expected,"wordsDE.txt has correct number of lines");
    t.end();
});

tape('autocomplete should read "wordsES.txt" file and save it with the correct number of lines',function(t){
    var linesInFile = auto.wordsES.length;
    var expected    = 12590;
    t.equals(linesInFile,expected,"wordsES.txt has correct number of lines");
    t.end();
});

tape('autocomplete should read "wordsFR.txt" file and save it with the correct number of lines',function(t){
    var linesInFile = auto.wordsFR.length;
    var expected    = 29149 ;
    t.equals(linesInFile,expected,"wordsFR.txt has correct number of lines");
    t.end();
});

tape('autocomplete should have the correct content',function(t){
    var actualDE     = auto.wordsDE[0][0];
    var expectedDE   = "18-carat";
    t.equals(actualDE,expectedDE,"wordsDE.txt has the correct 1st word");

    var actualES     = auto.wordsES[0][0];
    var expectedES   = "(academic) paper";
    t.equals(actualES,expectedES,"wordsES.txt has the correct 1st word");

    var actualFR     = auto.wordsFR[0][0];
    var expectedFR   = "'18' film";
    t.equals(actualFR,expectedFR,"wordsFR.txt has the correct 1st word");
    t.end();
});

tape('autocomplete returns an array with the first results of a 3-letter query (maximum 10)',function(t){
    var actualDE = JSON.parse(auto.autotranslate( '/word=air&lang=de' )).results[0][0];
    var expectedDE = 'air';
    t.deepEqual(actualDE, expectedDE,'query words for input "air"');

    var actualES = JSON.parse(auto.autotranslate( '/word=air&lang=es' )).results[0][0];
    var expectedES = 'air';
    t.deepEqual(actualES, expectedES,'query words for input "air"');

    var actualFR = JSON.parse(auto.autotranslate( '/word=air&lang=fr' )).results[0][0];
    var expectedFR = 'air';
    t.deepEqual(actualFR, expectedFR,'query words for input "air"');
    t.end();
});

tape('DE: returned array should include only words that start with the input', function(t){
    var actual =[];
    var result = JSON.parse(auto.autotranslate( '/word=bana&lang=de' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'banal', 'banalities', 'banality', 'banalization', 'banally', 'banana-shaped', 'banana', 'bananaphone', 'bananas', 'Banat'];
    t.deepEqual(actual, expected, '"bana" input excludes word "arabana"');
    t.end();
});

tape('ES: returned array should include only words that start with the input', function(t){
    var actual =[];
    var result = JSON.parse(auto.autotranslate( '/word=bac&lang=es' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'backbone ', 'backbone ', 'back', 'backpack', 'backstage', 'backstreet abortion', 'backstroke ', 'back then', 'back tooth', 'backwards' ];
    t.deepEqual(actual, expected, '"bana" input excludes word "arabana"');
    t.end();
});

tape('FR: returned array should include only words that start with the input', function(t){
    var actual =[];
    var result = JSON.parse(auto.autotranslate( '/word=bac&lang=fr' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'bacchanal', 'bachelor', 'bachelor degree', 'Bachelor of Arts degree <B.A.>', 'bachelor party ', 'back-hand', 'back and forth', 'backbone', 'back brush', 'back' ];
    t.deepEqual(actual, expected, '"bana" input excludes word "arabana"');
    t.end();
});

tape('DE: returned array should be case-sensitive', function(t){
    var actual =[];
    var result = JSON.parse(auto.autotranslate( '/word=london&lang=de' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'London', 'London-born', 'Londoner', 'Londoners', 'Londonese', 'Londonese', 'Londonish', 'Londonish', 'Londonization', 'Londonized' ];
    t.deepEqual(actual, expected, '"london" input returns London. ');
    t.end();
});

tape('ES: returned array should be case-sensitive', function(t){
    var actual =[];
    var result = JSON.parse(auto.autotranslate( '/word=lon&lang=es' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'London', 'loneliness', 'lonely', 'long-grain rice', 'long-life', 'long-lived', 'long-tailed mole', 'long-tailed', 'longevity', 'longitude' ];
    t.deepEqual(actual, expected, '"lon" input returns London ');
    t.end();
});

tape('FR: returned array should be case-sensitive', function(t){
    var actual =[];
    var result = JSON.parse(auto.autotranslate( '/word=lon&lang=fr' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'Londoner', 'Londoner ', 'London', 'lonely', 'lonely ', 'lonely ', 'long-crested eagle', 'long-distance call service', 'long-grain ', 'long-haired spider monkey' ];
    t.deepEqual(actual, expected, '"lon" input returns Londoner ');
    t.end();
});

tape('DE: user input matches words in wordsDE.txt even if it includes capital letters', function(t){
    var actual = [];
    var result = JSON.parse(auto.autotranslate( '/word=BUMP&lang=de' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'bump', 'bump', 'bump', 'bumped', 'bumper', 'bumpier', 'bumpily', 'bumpiness', 'bumping', 'bumpkinish' ];
    t.deepEqual(actual, expected, '"Bump" input still returns an array of ten words');
    t.end();
});

tape('ES: user input matches words in wordsES.txt even if it includes capital letters', function(t){
    var actual = [];
    var result = JSON.parse(auto.autotranslate( '/word=BE&lang=es' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'beach', 'beak', 'beam', 'beam ', 'bean', 'beans', 'bean sprout', 'bearable', 'bear cub', 'beard' ];
    t.deepEqual(actual, expected, '"Bump" input still returns an array of ten words');
    t.end();
});

tape('FR: user input matches words in wordsFR.txt even if it includes capital letters', function(t){
    var actual = [];
    var result = JSON.parse(auto.autotranslate( '/word=BE&lang=fr' ));
    for(var i=0;i<10;i++){
        actual.push(result.results[i][0]);
    }
    var expected = [ 'Be ...', 'beachball', 'beach', 'beadle', 'beak', 'beaming ', 'beam of light', 'beam ', 'beam ', 'bean goose' ];
    t.deepEqual(actual, expected, '"Bump" input still returns an array of ten words');
    t.end();
});

tape('time taken by the function should be less than 1s for ',function(t){
    var tStart  = new Date().getTime();
    var result = auto.autotranslate('/word=unpa&lang=de');
    var tEnd    = new Date().getTime();
    var timeTaken = tEnd - tStart;
    console.log(timeTaken);
    t.ok(timeTaken < 1000, 'autocomplete worst case takes less than 1s');
    t.end();
});
