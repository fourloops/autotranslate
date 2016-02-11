//this function reads what is in the textbox

window.addEventListener('keyup', function(k){
	document.getElementById('results').innerHTML='';
	checkLength();
});

function checkLength(){
	var word = document.getElementById('myInput').value;
	if(word.length < 2) {
		return;
	} else requestWords(word);
}

function requestWords(word){
	var xhr = new XMLHttpRequest();
	var result = [];
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			var res = xhr.responseText;
			result = res.split(',');
		}
	}
	xhr.open("GET", 'word=' + word, false);
	xhr.send();
	listifyWords(result);
}

function listifyWords(array){
	array.map(function(x, i) {
		var node = document.createElement("li");
		node.innerHTML = x;
		node.classList.add('word'+(i+1));
		document.getElementById('results').appendChild(node);
	});
}