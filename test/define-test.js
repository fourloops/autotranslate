var tape = require('tape');
var define = require('../src/define.js');


tape('Check the definitionGetter function returns an array of objects', function(t) {
    define.definitionGetter("monkey", function(respString){
        var actual = JSON.parse(respString);
        t.ok(actual instanceof Array, 'result should be an array');
        t.ok(actual[0] instanceof Object, 'first element of array should be an object');
        t.ok(actual[1] instanceof Object, 'second element of array should be an object');
        t.end();
    });
});

tape('Check definitionGetter\'s returned array of objects contain partOfSpeech and text keys', function(t) {
    define.definitionGetter('baboon', function(respString){
        var actual = JSON.parse(respString);
        t.ok(actual[0].partOfSpeech, 'first entry should have a partOfSpeech property');
        t.ok(actual[0].text, 'first entry should have a text property');
        t.end();

    });
});

tape('Check definitionFilter returns a stringified object containing only the partOfSpeech and text keys of the first entry', function(t) {
    var expected1 = '{"definition":"Any of various fleshy fungi of the class Basidiomycota, characteristically having an umbrella-shaped cap borne on a stalk, especially any of the edible kinds, as those of the genus Agaricus.","partOfSpeech":"noun"}';
    define.definitionGetter('mushroom',function(respString){
        var actual1 = define.definitionFilter(respString);
        t.equal(actual1, expected1, 'definitionFilter works for the word "mushroom".');
        t.end();
    });
});

tape('Check definitionFilter returns another stringified object containing only the partOfSpeech and text keys of the first entry', function(t) {
    var expected2 = '{"definition":"An instinctive physical desire, especially one for food or drink.","partOfSpeech":"noun"}';
    define.definitionGetter('appetite',function(respString){
        var actual2 = define.definitionFilter(respString);
        t.equal(actual2, expected2, 'definitionFilter works for the word "appetite".');
        t.end();
    });
});

tape('Unrecognised user input returns a default 404 message', function (t){
    var expected3 ='{"en":["FOUR ZERO FOUR","Sorry, we can\'t find your definition."],"fr":["QUATRE ZÉRO QUATRE","Désolé, nous ne pouvons pas trouver votre définition."],"es":["CUATRO CERO CUATRO","Lo sentimos, no podemos encontrar su definición."],"de":["VIER NULL VIER","Leider können wir nicht ihr Bestimmung finden."]}';
    define.definitionGetter('hgjkl', function(respString){
        var actual3 = define.definitionFilter(respString);
        console.log(actual3);
        t.equal(actual3, expected3, 'definition Filter recognises error and displays default message');
        t.end();
    });
});
