// File used to cut down length of German dictionary from 
// 1,000,000+ words to under 250,000

var fs = require('fs');

fs.readFile('shortenedWordsDE.txt', 'utf8', function(err, data){
	var result = data.split("\n")
					 .filter(x => x.indexOf('undefined') === -1)
                     .map(x => x.split('\t'));

	var returnObject = result.map(x => x.join('\t')).join('\n');

	fs.writeFile('evenShorterWordsDE.txt', returnObject, function(err){
		if (err) {
			return console.error(err);
		}
	});
});
