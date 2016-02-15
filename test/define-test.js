var tape = require('tape');
var define = require('../src/define.js')


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
    var expected1 = {
        text: "Any of various fleshy fungi of the class Basidiomycota, characteristically having an umbrella-shaped cap borne on a stalk, especially any of the edible kinds, as those of the genus Agaricus.",
        partOfSpeech: 'noun'
    }
    define.definitionGetter('mushroom',function(respString){
        var actual1 = define.definitionFilter(respString);
        t.deepEqual(actual1,expected1, 'definitionFilter works for the word "mushroom".');
        t.end();
    });
});
