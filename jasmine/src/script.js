window.addEventListener('keyup', function(k){
	document.getElementById('results').innerHTML='';
	checkLength();
});

function checkLength(){
	var word = document.getElementById('myInput').value;
	if(word.length < 2) {
		return;
	} else {
		requestWords(word);
	}
}

function requestWords(word){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			var res = xhr.responseText.split(',');
			listifyWords(res);
		}
	};
	xhr.open("GET", 'word=' + word);
	xhr.send();
}

function listifyWords(array){
	array.map(function(x, i) {
		var node = document.createElement("li");
		node.innerHTML = x;
		node.classList.add('word'+(i+1));
		document.getElementById('results').appendChild(node);
	});
}