window.addEventListener('keyup', function(k){
	document.getElementById('translations').innerHTML='';
	document.getElementById('suggestions').innerHTML='';
	checkLength2();
});

// function checkLength(){
// 	var word = document.getElementById('myInput').value;
// 	if(word.length < 2) {
// 		return;
// 	} else {
// 		requestWords(word);
// 	}
// }

// function requestWords(word){
// 	var xhr = new XMLHttpRequest();
// 	xhr.onreadystatechange = function(){
// 		if(xhr.readyState == 4 && xhr.status == 200){
// 			var res = xhr.responseText.split(',');
// 			listifyWords(res);
// 		}
// 	};
// 	xhr.open("GET", 'word=' + word);
// 	xhr.send();
// }

// function listifyWords(array){
// 	array.map(function(x, i) {
// 		var node = document.createElement("li");
// 		node.innerHTML = x;
// 		node.classList.add('word'+(i+1));
// 		document.getElementById('suggestions').appendChild(node);
// 	});
// }

// FOR TRANSLATIONS AS WELL
var currentLang = 'es';

function checkLength2(){
	var word = document.getElementById('myInput').value;
	if(word.length < 2) {
		return;
	} else {
		requestWordsAndTranslations(word, currentLang);
	}
}

function requestWordsAndTranslations(word, lang){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			var res = JSON.parse(xhr.responseText);
			listifyTranslations(res.results);
		}
	};
	xhr.open("GET", 'wordAndTrans=' + word + '&lang=' + lang);
	xhr.send();
}

function listifyTranslations(array){
	document.getElementById('translations').innerHTML='';
	document.getElementById('suggestions').innerHTML='';
	array.map(function(x, i) {
		var nodeSuggestions = document.createElement("li");
		var	nodeTranslations = document.createElement("li");
		nodeSuggestions.innerHTML = x[0];
		nodeTranslations.innerHTML = x[1] + ' (' + x[2] + ')';
		nodeSuggestions.classList.add('word'+(i+1));
		document.getElementById('suggestions').appendChild(nodeSuggestions);
		document.getElementById('translations').appendChild(nodeTranslations);
	});
}





