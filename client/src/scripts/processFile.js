//import pdfjsLib from 'pdfjs-dist';
//const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
import * as pdfjsLib from 'pdfjs-dist/webpack';

export function extractPDFText(files){
    const promises = [];
    for(var i = 0; i < files.length; i++){
        const reader = new FileReader();
        const promise = new Promise((resolve, reject) => {
            reader.onload = function(){
                const buffer = reader.result;
                const typedArray = new Uint8Array(buffer);
                var pdf = pdfjsLib.getDocument(typedArray);
                return pdf.promise.then(function(pdf) { // get all pages text
                    var maxPages = pdf.numPages;
                    var countPromises = []; // collecting all page promises
                    for (var j = 1; j <= maxPages; j++) {
                        var page = pdf.getPage(j);

                        countPromises.push(page.then(function(page) { // add page promise
                            var textContent = page.getTextContent();
                            return textContent.then(function(text){ // return content promise
                                return text.items.map(function (s) { return s.str; }).join(' '); // value page text 
                            });
                        }));
                    }
                    // Wait for all pages and join text
                    return Promise.all(countPromises).then(function (texts) {
                        //setAttachText(texts.join(''));
                        resolve(texts.join(''));
                    });
                }).catch(function(error) {
                    reject(error);
                });
            };
            reader.readAsArrayBuffer(files[i]);
        });
        promises.push(promise);
            
    }
    return Promise.all(promises);
}