var tape = require('tape');
var func = require('../src/pixabay.js');

tape('pixabayGetter function should return an array of objects with the results of the call to pixabay api (taking a word as a parameter)',function(t){
    func.pixabayGetter( 'confused', function(res){
        var arrObjs = res;
        t.equal( typeof arrObjs, "string", 'response from Pixabay API is a string' );
        t.end();
    });
});

tape('imgURLGetter function should return a string with a webformatURL (at random)',function(t){
    func.pixabayGetter('stunned', function( res ) {
        var actual = res;
        t.equal( typeof actual, 'string', 'result is a string'  );
        t.ok( actual.indexOf('.jpg') > -1, 'result ends with ".jpg" and so is an image url');
        t.ok( actual.indexOf('https://pixabay.com/get/') > -1, 'result gets image URL using pixabay API');
        t.end();
    });
});

tape('imgURLGetter should return a standard 404 image URL if the picture has not been found on pixabay', function(t){
    func.pixabayGetter('xbrgltyvswq', function( res ){
        var actual = res;
        t.equal( typeof actual, 'string', 'result is a string'  );
        t.ok( actual.indexOf('.png') > -1, 'result ends with ".png" and so is an image url (not from pixabay)');
        t.ok( actual.indexOf('assets/not-found') > -1, 'result gets image from assets folder');
        t.end();
    });
});
