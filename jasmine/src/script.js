(function(){

var currentLang = 'es';
var count = -1;

document.getElementById('de').addEventListener('click', function(e){
	currentLang = 'de';
	checkLength();
	document.getElementById('fr').classList.remove('currentLanguage');
	document.getElementById('es').classList.remove('currentLanguage');
	document.getElementById('de').classList.add('currentLanguage');
	document.body.style.backgroundImage = 'url(https://upload.wikimedia.org/wikipedia/commons/a/a6/Brandenburger_Tor_abends.jpg)';
});

document.getElementById('fr').addEventListener('click', function(e){
	currentLang = 'fr';
	checkLength();
	document.getElementById('de').classList.remove('currentLanguage');
	document.getElementById('es').classList.remove('currentLanguage');
	document.getElementById('fr').classList.add('currentLanguage');
	document.body.style.backgroundImage = 'url(http://www.destination360.com/contents/pictures/paris/notre-dame-paris-hours.jpg)';

});

document.getElementById('es').addEventListener('click', function(e){
	currentLang = 'es';
	checkLength();
	document.getElementById('de').classList.remove('currentLanguage');
	document.getElementById('fr').classList.remove('currentLanguage');
	document.getElementById('es').classList.add('currentLanguage');
	document.body.style.backgroundImage = 'url(http://greatphotojournalism.com/thumbs2/1440x960/fotos/store/res_15479.jpg)';
});

document.getElementById("myInput").addEventListener('keyup', function(k){
	if(k.keyCode>45 && k.keyCode<91 || k.keyCode === 8){
		count = -1;
		document.getElementsByClassName("definition")[0].classList.remove("visible");
		document.getElementById('translations').innerHTML='';
		document.getElementById('suggestions').innerHTML='';
		checkLength();
	}
	else if(k.keyCode===13){
		count = -1;
		document.getElementsByClassName("definition")[0].classList.add("visible");
		var defRequest = document.getElementById("myInput").value;
		var http = new XMLHttpRequest();
		http.onreadystatechange = function(){
			if(http.readyState == 4 && http.status == 200){
				var defObj = http.responseText.split("/n")[0];
				var imgURL = http.responseText.split("/n")[1];
			}
		};
		http.open("GET", 'def=' + defRequest);
		http.send();
	}
});

window.addEventListener('keydown', function(k){
	if(k.keyCode===38){
		if(count>0){
			count--;
			for(i=0;i<document.getElementsByClassName("word").length;i++){
				document.getElementsByClassName("word")[i].classList.remove("focus");
				document.getElementsByClassName("translated")[i].classList.remove("focus");
			}
			document.getElementsByClassName("word")[count].classList.add("focus");
			document.getElementsByClassName("translated")[count].classList.add("focus");
			document.getElementById("myInput").value=document.getElementsByClassName("word")[count].innerHTML;
		}
	}
	else if(k.keyCode===40){
		if(count < document.getElementsByClassName("word").length && count < 9){
			count++;
			for(i=0;i<document.getElementsByClassName("word").length;i++){
				document.getElementsByClassName("word")[i].classList.remove("focus");
				document.getElementsByClassName("translated")[i].classList.remove("focus");
			}
			document.getElementsByClassName("word")[count].classList.add("focus");
			document.getElementsByClassName("translated")[count].classList.add("focus");
			document.getElementById("myInput").value=document.getElementsByClassName("word")[count].innerHTML;
		}
	}
});

window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

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
		nodeSuggestions.classList.add('word');
		nodeTranslations.classList.add('translated');
		document.getElementById('suggestions').appendChild(nodeSuggestions);
		document.getElementById('translations').appendChild(nodeTranslations);
	});
}

})();
