require('env2')('./config.env');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//call to Pixabay API
function pixabayGetter ( tag, callback ) {
    var key = process.env.PIXABAY;
    var url = 'https://pixabay.com/api/?key=' + key + '&q=' + tag + '&image_type=photo';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var randomImage = imgURLGetter(xhr.responseText);
            callback(randomImage);
        }
    };
    xhr.open('GET', url);
    xhr.send();
}

//function that provides default image in case of an error
function errorImage() {
    return "../assets/not-found-fr.png";
}

//function that randomly selects image by matching tags to the user input
function imgURLGetter( apiResult ){
    var imgArr = JSON.parse( apiResult ).hits;
    if (imgArr.length === 0) { return errorImage();}
    var numHits = imgArr.length;
    var randomImgIndex = Math.floor( Math.random() * numHits );
    return imgArr[ randomImgIndex ].webformatURL;
}

module.exports = {
    pixabayGetter: pixabayGetter,
    imgURLGetter: imgURLGetter
};
