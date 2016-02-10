var baseUrl = 'https://glosbe.com/gapi/'
var english = "eng";
var italian = "it";
var spanish = "es";
var phrase  = 'beautiful';

var url = baseUrl+'translate?from='+english+'&dest='+italian+'&format=json'+'&phrase='+phrase;

console.log(url);

var paragraph = '';
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        paragraph += response.tuc[0].phrase;
        document.querySelector('p').innerHTML = paragraph;
    }
}
xhr.open('GET',url);
console.log('1');
xhr.send();
console.log('2');
