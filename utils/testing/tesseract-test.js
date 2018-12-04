var tesseract = require('node-tesseract');
 const path = require("path")
// Recognize text of any language in any format

var options = {
    psm: 12
};
tesseract.process(path.join(__dirname,'capture.png'), options,function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text.split("\n\n"));
    }
});