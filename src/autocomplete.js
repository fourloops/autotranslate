var fs = require("fs");

// Read wordsDE file and splits it into 2D array, with each definition an
// array containing English word, German word, and type of word.
var wordsDE = fs.readFileSync("text/wordsDE.txt", "utf8").split("\n")
                                                    .map(x => x.split('\t'));

var wordsES = fs.readFileSync("text/wordsES.txt", "utf8").split("\n")
                                                    .map(x => x.replace(/^to\s/, ''))
                                                    .map(x => x.split('\t'));

var wordsFR = fs.readFileSync("text/wordsFR.txt", "utf8").split("\n")
                                                    .map(x => x.replace(/^to\s/, ''))
                                                    .map(x => x.split('\t'));

// ------ deAuto takes url in the format '/wordAndTrans=someWord' , and -------
// ------ returns JSON object containing a 2D array of suggestions ----

function autotranslate( url ){
    var lang = url.split('&lang=')[1];
    var word = url.split('&lang=')[0].replace('/word=', '').toLowerCase();
    var dict;
    if(lang === 'es'){
        dict = wordsES;
    } else if (lang === 'de') {
        dict = wordsDE;
    } else {
        dict = wordsFR;
    }
    // strip URL to just the word, lowercase, with '^' for regex
    // var regex = '^' + url.replace("/wordAndTrans=","").toLowerCase();
    var results = [];
    for( var i = 0, x = dict.length-1; i < x ; i++ ){
        var reg1 = new RegExp( '^' + word + '$');
        var lowerWord = dict[i][0].toLowerCase();
        if( reg1.test( lowerWord )  ){
            // if the English word of a definition array matches the word, push the
            //whole definition, stripped of annotations (which would be in sq. brackets or parentheses)
            results.push( dict[i].map(x => x.replace(/\[[^\[\]]+\]/g, '').replace(/\([^\(\)]+\)/g, '')) );
            // once results has 10 items, stop searching
            if( results.length >= 3 ){
                break;
            }
        }
    }
    for( var j = 0, y = dict.length-1; j < y ; j++ ){
        var reg2 = new RegExp( '^' + word );
        var lowerWord2 = dict[j][0].toLowerCase();
        if( reg2.test( lowerWord2 ) && results.filter(x => x[0] === lowerWord2).length === 0 ){
            // if the English word of a definition array matches the word, push the
            //whole definition, stripped of annotations (which would be in sq. brackets or parentheses)
            results.push( dict[j].map(x => x.replace(/\[[^\[\]]+\]/g, '').replace(/\([^\(\)]+\)/g, '')) );
            // once results has 10 items, stop searching
            if( results.length >= 10 ){
                break;
            }
        }
    }
    // return array in object as JSON string
    var returnObj = {results};
    return JSON.stringify(returnObj);
}

module.exports = {
    wordsDE         :   wordsDE,
    wordsFR         :   wordsFR,
    wordsES         :   wordsES,
    autotranslate   :   autotranslate
};
