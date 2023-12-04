import { FLASK_PROXY } from "./config.js";
export async function extractText(files){
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
    }

    try{
        const response = await fetch(`${FLASK_PROXY}/pdf/extract`, { 
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const texts = await response.json(); // Parse the response as JSON

        console.log(texts); // Process the extracted array of text
        return texts;

    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        //nothing
    }
    return;
}