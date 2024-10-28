//import pdfjsLib from 'pdfjs-dist';
//const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
import * as pdfjsLib from 'pdfjs-dist/webpack';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import {
    Document,
    Packer,
    Paragraph,
    TextRun
  } from 'docx';



async function convertDocxToMarkdown(files) {
    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }
    
    const mdStrings = [];
  
    for (const file of files) {
      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const result = await mammoth.extractRawText({ arrayBuffer });
        const mdString = result.value.replace(/!\[.*?\]\(.*?\)/g, ''); // Remove images
        mdStrings.push(mdString);
      } catch (error) {
        toast.error(`Failed to convert ${file} to markdown`);
      }
    }
    return mdStrings;
}

function processPDFs(files){
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
                    toast.error(error.toString());
                });
            };
            reader.readAsArrayBuffer(files[i]);
        });
        promises.push(promise);
            
    }
    return Promise.all(promises);
}

export async function processFiles(files){
    const pdfs = [];
    const docx = [];
    for(var i = 0; i < files.length; i++){
        if(files[i].type === "application/pdf"){
            pdfs.push(files[i]);
        }else if(files[i].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
            docx.push(files[i]);
        }
    }
    const pdfTexts = await processPDFs(pdfs);
    const docxTexts = await convertDocxToMarkdown(docx);
    const list_filesTexts = pdfTexts.concat(docxTexts);
    return list_filesTexts;
}

export async function commentsToDocx(commentsArray){

    const paragraphs = commentsArray.map((comment, index) => (
    new Paragraph({
        children: [
            new TextRun({
                text: `${comment["Style-Guide"]["Edited Comment"]}`,
                break: 1 // This adds a line break after each comment
                }),
            ],
        })
    ));

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: paragraphs,
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "comments.docx");
        console.log("Document created successfully");
    });
}