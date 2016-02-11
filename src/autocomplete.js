var fs = require("fs");

var words = fs.readFileSync("words.txt", "utf8"//, function(err, data){
    // if (err){
    //     console.log(err);
    // }
    // else {
    // // console.log("hello");
    // }
/*}*/).split("\n");

module.exports = {
    words : words
}
