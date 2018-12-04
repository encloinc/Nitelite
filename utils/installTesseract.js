const fs = require('fs');
const request = require('request');
const AdmZip = require('adm-zip');
const path = require("path")

const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);
    const sendReq = request.get(url);

    // verify response code
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        sendReq.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request errors
    sendReq.on('error', (err) => {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
};

download("https://www.dropbox.com/s/8t54mz39i58qslh/tesseract-3.05.00dev-win32-vc19.zip?dl=1", path.join(__dirname, "./bin/tesseract.zip"), function(e){

	  var zip = new AdmZip(path.join(__dirname, "./bin/tesseract.zip"));
	  zip.extractAllToAsync(path.join(__dirname, "./bin/"), true, function(e){

            download("https://www.dropbox.com/s/sjagisaervcijna/tessdata.zip?dl=1", path.join(__dirname, "./bin/tessdata/tessdata.zip"), function(e){
                
              var zip = new AdmZip(path.join(__dirname, "./bin/tessdata/tessdata.zip"));
              zip.extractAllTo(path.join(__dirname, "./bin/tessdata/"), true);

            });
      });


})