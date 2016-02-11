//this function reads what is in the textbox

var array = ['word', 'ward', 'warlock', 'warrior', 'wanton', 'wonton', 'wally', 'wand', 'want', 'warden'];

listifyWords(array);

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
			result = res.substr(1, res.length-2)
						.replace(/\'/g, '')
						.split(', ');
		}
	}
	xhr.open("GET", 'word=' + word, false);
	xhr.send();
	return result;
}

function listifyWords(array){
	array.map(function(x, i) {
		var node = document.createElement("li");
		node.innerHTML = x;
		node.classList.add('word'+(i+1));
		document.getElementById('results').appendChild(node);
	});
}