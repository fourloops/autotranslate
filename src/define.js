require('env2')('./config.env');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//function that makes calls to Wordnik's API
function definitionGetter( word, callback ){
    var publicKey = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    var key = process.env.WORDNIK || publicKey;
    var url = 'http://api.wordnik.com:80/v4/word.json/' + word + '/definitions?limit=200&includeRelated=false&sourceDictionaries=ahd&useCanonical=true&includeTags=false&api_key=' + key;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.status === 200 && xhr.readyState === 4 ){
            callback( xhr.responseText );
        }
    };
    xhr.open('GET',url);
    xhr.send();
}

//function that selects and returns the first definition brought up by the API including the part of speech.
function definitionFilter( apiResp ) {
    if ( apiResp === '[]' ) return noDefinition();
    var firstEntry = JSON.parse( apiResp )[0];
    return JSON.stringify( {definition : firstEntry.text, partOfSpeech : firstEntry.partOfSpeech} );
}

//function that returns a default error message in case of an error
function noDefinition() {
    return '{"en":["FOUR ZERO FOUR","Sorry, we can\'t find your definition."],"fr":["QUATRE ZÉRO QUATRE","Désolé, nous ne pouvons pas trouver votre définition."],"es":["CUATRO CERO CUATRO","Lo sentimos, no podemos encontrar su definición."],"de":["VIER NULL VIER","Leider können wir nicht ihr Bestimmung finden."]}';
}

module.exports = {
    definitionGetter: definitionGetter,
    definitionFilter: definitionFilter
};
