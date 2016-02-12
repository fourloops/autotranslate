require('env2')('./config.env');
var apikey = process.env.YANDEX;
var request = require('request');
var info='fjgf';

function translate(word, lang, callback){
    request("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=" + apikey + "&lang=en-" + lang + "&text=" + word, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body).def[0].tr[0].text;
            return callback(result);
        }
    });
}

// console.log(deTranslate("time"));

translate('Hello', 'de', function(translation){
    console.log(translation);
});

module.exports = {
    translate: translate
};
