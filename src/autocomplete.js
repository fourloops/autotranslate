var fs = require("fs");

var words = fs.readFileSync("words.txt", "utf8").split("\n");

function autocomplete( url ){
    var userInput = url.replace("/word=","");
    var results = [];
    var check = '^' + userInput.toLowerCase();
    var re = new RegExp( check );
    for( var i=0, x=words.length-1; i < x ; i++ ){
        var lowerWord = words[i].toLowerCase();
        if( lowerWord.match( re ) ){
            results.push( lowerWord );
            if( results.length >= 10 ){
                break;
            }
        }
    }
    return results;
}

module.exports = {
    words        :   words,
    autocomplete :   autocomplete
};
