describe("autocomplete function", function() {
  it("gets value from text box with id 'myInput'", function() {
  	document.getElementById('myInput').value = "word";
    expect(autocomplete()).toBe("word");
  });
  it("returns undefined if word is shorter than 2 letters", function() {
  	document.getElementById('myInput').value = "wo";
    expect(autocomplete()).toBe(undefined);
  });
  it("sends the word to the server and receives response", function() {
  	document.getElementById('myInput').value = "wo";
    expect(autocomplete()).not.toBe(undefined);
  });
});