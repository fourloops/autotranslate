(function(){

var currentLang = 'es';
var count = -1;

document.getElementById('de').addEventListener('click', function(e){
	toggleClasses('de');
});

document.getElementById('fr').addEventListener('click', function(e){
	toggleClasses('fr');
});

document.getElementById('es').addEventListener('click', function(e){
	toggleClasses('es');
});

function toggleClasses(lang){
	currentLang = lang;
	document.getElementById('fr').classList.remove('currentLanguage');
	document.getElementById('es').classList.remove('currentLanguage');
	document.getElementById('de').classList.remove('currentLanguage');
	document.getElementById(lang).classList.add('currentLanguage');
	document.body.style.backgroundImage = 'url(./assets/' + lang + 'Background.jpg)';
	checkLength();
}

function addClickEvents(){
	for(var i=0;i<document.getElementsByClassName("word").length;i++){
		document.getElementsByClassName("word")[i].addEventListener('click', function(e){
			var searchText = this.innerHTML;
			document.getElementById("myInput").value=searchText;
			document.getElementById("myInput").focus();
			getDefinition(searchText);
		});
	}
}

function getDefinition(word){
	var http = new XMLHttpRequest();
	http.onreadystatechange = function(){
		if(http.readyState == 4 && http.status == 200){
			var definitionDiv = document.getElementById("definition");
			definitionDiv.innerHTML = "";
			definitionDiv.classList.add("visible");
			// parse the response from the server ( a stringified object and a url string separated by a \n )
			var serverResponse = http.responseText.split("\n");
			// the first element of the parsed response is the definition from wordnik api
			var defObj = JSON.parse( serverResponse[0] );
			// create a <p> tag with the definition of the selected word and its word type
			var defP = document.createElement('p');
			defP.id = "definition-paragraph";
			defP.innerHTML = defObj.definition + "<br><br>"+ defObj.partOfSpeech;
			document.getElementById('suggestions').innerHTML = "";
			// document.getElementById('translations').innerHTML = "";
			// append the two <p> html elements to the definitionDiv
			definitionDiv.appendChild(defP);
			// the second element of the parsed response is the url of the image from pixabay
			var imgURL = http.responseText.split("\n")[1];
			// the body's backgroundImage will change to the image fetched from pixabay
			document.body.style.backgroundImage = "url(" + imgURL + ")";
		}
	};
	http.open("GET", 'def=' + word);
	http.send();
}

document.getElementById("myInput").addEventListener('keyup', function(k){
	// if any letter key or backspace, clear old suggestions/translations and get new ones
	if(k.keyCode>45 && k.keyCode<91 || k.keyCode === 8){
		count = -1;
		document.getElementsByClassName("definition")[0].classList.remove("visible");
		document.getElementById('translations').innerHTML='';
		document.getElementById('suggestions').innerHTML='';
		document.getElementById('definition').innerHTML='';
		checkLength();
	}
	// if "ENTER"
	else if(k.keyCode===13){
		count = -1;
		var defRequest = document.getElementById("myInput").value;
		getDefinition(defRequest);
	}
});

window.addEventListener('keydown', function(k){
	if(k.keyCode===38){
		if(count>0){
			count--;
			for(var i=0;i<document.getElementsByClassName("word").length;i++){
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
			for(var i=0;i<document.getElementsByClassName("word").length;i++){
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
	addClickEvents();
}

})();
