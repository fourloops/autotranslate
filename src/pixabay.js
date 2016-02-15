require('env2')('./config.env');
var XMLHttpRequest = require('xmlhttpRequest').XMLHttpRequest;

function pixabayGetter ( tag, callback ) {
    var key = process.env.PIXABAY || prompt('please enter a valid key');
    var url = 'https://pixabay.com/api/?key=' + key + '&q=' + tag + '&image_type=photo';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    }
    xhr.open('GET', url);
    xhr.send();
}

function imgURLGetter( apiResult ){
    var imgArr = JSON.parse( apiResult ).hits;
    var numHits = imgArr.length;
    var randomImgIndex = Math.floor( Math.random() * numHits );
    return imgArr[ randomImgIndex ].webformatURL;
}

module.exports = {
    pixabayGetter: pixabayGetter,
    imgURLGetter: imgURLGetter
}
