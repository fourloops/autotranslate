//this function reads what is in the textbox
function autocomplete(){
	var word = document.getElementById('myInput').value;
	if(word.length < 2) {
		console.log('SHORT WORD');
		return undefined;
	}
	var xhr = new XMLHttpRequest();
	var result = ''
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			result += xhr.responseText;
		}
	}
	xhr.open("GET", 'word=' + word, false);
	xhr.send();
	return result;
}

