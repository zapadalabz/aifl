import { PROXY } from './config';

async function handleStreamedResponse(response,setOutput) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialText = '';
    //console.log(reader);
    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // Process the received chunk of text
            partialText += decoder.decode(value);
            
            // Assuming you want to display the text in an HTML element with the id "output"
            //document.getElementById("output").textContent = partialText;
            //console.log(partialText);
            setOutput(partialText);
        }
    } catch (error) {
        console.error(error);
    }
}

export async function setAnswer(prompt,currentOutput, setOutput){
    let running = false;

    if (running) {
        return;
    }
    running = true;
    try {
        //console.log(prompt);
        fetch(`${PROXY}/hf/${prompt}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponse(response,setOutput))
            .catch((error) => {
                console.error('Fetch error:', error);
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        running = false;
    }
    return;
}



async function handleStreamedResponseMessages(response, messages, setMessages) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialText = '';
    /*setMessages([...messages,{
        message: partialText,
        direction: 'incoming',
        sender: "Ribbit"
    }]);*/
    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // Process the received chunk of text
            partialText += decoder.decode(value);
            
            // Assuming you want to display the text in an HTML element with the id "output"
            //document.getElementById("output").textContent = partialText;
            //console.log(partialText);
            
            //temp[temp.length - 1].message = partialText;
            //console.log(temp);
            //setPartial(partialText);
            messages[messages.length-1].message = partialText.replace("</s>","");
            setMessages([...messages]);
        }
        //console.log(messages);

    } catch (error) {
        console.error(error);
    }
}

export async function setResponse(prompt, messages, setMessages, running, setRunning, attachText){
    //let running = false;

    if (running) {
        return;
    }
    setRunning(true);
    //append attachText to the prompt
    try {
        //console.log(prompt);
        fetch(`${PROXY}/hf/${prompt}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponseMessages(response, messages, setMessages))
            .catch((error) => {
                console.error('Fetch error:', error);
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        setRunning(false);
    }
    return;
}