require('env2')('./config.env');
var apikey = process.env.YANDEX;
var request = require('request');

function translate(url, callback){
	var lang = url.split('lang=')[1];
	var word = url.split('&lang=')[0].replace('def=', '');
    request("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=" + apikey + "&lang=en-" + lang + "&text=" + word, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body).def[0].tr[0].text;
            return callback(result);
        }
    });
}

module.exports = {
    translate: translate
};
