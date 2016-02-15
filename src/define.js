require('env2')('./config.env');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function definitionGetter( word, callback ){
    var publicKey = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    var key = process.env.WORDNIK || publicKey;
    var url = 'http://api.wordnik.com:80/v4/word.json/' + word + '/definitions?limit=200&includeRelated=false&sourceDictionaries=ahd&useCanonical=true&includeTags=false&api_key=' + key;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.status === 200 && xhr.readyState === 4 ){
            callback(xhr.responseText);
        }
    }
    xhr.open('GET',url);
    xhr.send();
}

function definitionFilter( apiResp ) {
    var firstEntry = JSON.parse( apiResp )[0]
    return JSON.stringify( {definition : firstEntry.text, partOfSpeech : firstEntry.partOfSpeech} );
}

module.exports = {
    definitionGetter: definitionGetter,
    definitionFilter: definitionFilter
}
