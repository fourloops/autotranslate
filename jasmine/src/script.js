(function(){

// window.addEventListener('keyup', function(k){
// 	checkLength();
// });

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

document.getElementById('de').addEventListener('click', function(e){
	currentLang = 'de';
	checkLength();
	document.getElementById('fr').classList.remove('currentLanguage');
	document.getElementById('es').classList.remove('currentLanguage');
	document.getElementById('de').classList.add('currentLanguage');
});

document.getElementById('fr').addEventListener('click', function(e){
	currentLang = 'fr';
	checkLength();
	document.getElementById('de').classList.remove('currentLanguage');
	document.getElementById('es').classList.remove('currentLanguage');
	document.getElementById('fr').classList.add('currentLanguage');
});

document.getElementById('es').addEventListener('click', function(e){
	currentLang = 'es';
	checkLength();
	document.getElementById('de').classList.remove('currentLanguage');
	document.getElementById('fr').classList.remove('currentLanguage');
	document.getElementById('es').classList.add('currentLanguage');
});

window.addEventListener('keyup', function(k){
	document.getElementById('translations').innerHTML='';
	document.getElementById('suggestions').innerHTML='';
	checkLength();
});

function checkLength(){
	var word = document.getElementById('myInput').value;
	if(word.length < 2) {
		return;
	} else {
		requestWordsAndTranslations(word);
	}
}

function requestWordsAndTranslations(word){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			var res = JSON.parse(xhr.responseText);
			listifyTranslations(res.results);
		}
	};
	xhr.open("GET", 'word=' + word + '&lang=' + currentLang);
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

})();

