var tape = require('tape');
var func = require('../src/pixabay.js');

tape('pixabayGetter function should return an array of objects with the results of the call to pixabay api (taking a word as a parameter)',function(t){
    func.pixabayGetter( 'confused', function(res){
        var arrObjs = JSON.parse(res).hits;
        console.log(arrObjs);
        t.ok( arrObjs instanceof Array, 'response from Pixabay API is an array' );
        t.ok( arrObjs[0] instanceof Object, 'which has objects in it');
        t.end();
    });
});

tape('imgURLGetter function should return a string with an webformatURL (at random)',function(t){
    func.pixabayGetter('stunned', function(res) {
        var actual = func.imgURLGetter( res )
        t.ok( typeof actual, 'string', 'result is a string'  );
        t.ok( actual.indexOf('.jpg') > -1, 'result ends with ".jpg" and so is an image url');
        t.ok( actual.indexOf('https://pixabay.com/get/') > -1, 'result gets image URL using pixabay API')
        t.end();
    });
});
