import { PROXY, FLASK_PROXY } from './config';

async function handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory) {
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

            chatHistory[lengthChatHistory-1].content = partialText;
            //console.log(partialText);
            setChatHistory([...chatHistory]);
        }

    } catch (error) {
        console.error(error);
    }
}

export async function loopSetChatHistory(setChatHistory){
    for(let i=0;i<10;i++){
        setChatHistory(prevChatHistory => [
            ...prevChatHistory,
            {
              content: "message",
              role: 'user',
              attachments: []
            },
            {
              content: '',
              role: 'assistant'
            }
          ]);
    }
    return "done";
}


export async function postOpenAIResponse(chatHistory, setChatHistory){
    const lengthChatHistory = chatHistory.length;

    const chat = chatHistory[lengthChatHistory - 2];
    //console.log(chatHistory);
    const prompt = chat.content + chat.attachments.map((text, index) => `\n\ndocument_${index}: \`\`\`${text}\`\`\``).join('');
    try {
        fetch(`${PROXY}/openAI/post`, { 
            method: "POST",
            body: JSON.stringify({"prompt": encodeURIComponent(prompt)}),
            headers: {
            'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory))
            .catch((error) => {
                console.error('Fetch error:', error);
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        //nothing
    }
    
    return;
}


export async function postOpenAIChatResponse(chatHistory, setChatHistory, model){
    const lengthChatHistory = chatHistory.length;
    
    let systemMessage = "You are an experienced teacher helping fellow colleagues.";
    let msgHistory = [{"role" : "system", "content" : systemMessage}]; //Include the attachments into the history

    for(let i = 0; i < lengthChatHistory-1; i++){
        let chat = chatHistory[i];
        if(chat.role === "user"){
            msgHistory.push({"role" : chat.role, "content" : chat.content + chat.attachments.map((text, index) => `\n\ndocument_${index}: \`\`\`${text}\`\`\``).join('')});
        }else{
            msgHistory.push({"role" : chat.role, "content" : chat.content});
        } 
    }

    try {
        fetch(`${PROXY}/openAI/postChat`, { 
            method: "POST",
            body: JSON.stringify({"chatHistory": msgHistory, "model": model}),
            headers: {
            'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory))
            .catch((error) => {
                console.error('Fetch error:', error);
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        //nothing
    }
    
    return;
}

export async function postPythonOpenAIChatResponse(chatHistory, setChatHistory, model){
    const lengthChatHistory = chatHistory.length;
    //console.log(model);

    let systemMessage = "You are an experienced teacher helping fellow colleagues.";
    let msgHistory = [{"role" : "system", "content" : systemMessage}]; //Include the attachments into the history

    for(let i = 0; i < lengthChatHistory-1; i++){
        let chat = chatHistory[i];
        if(chat.role === "user"){
            msgHistory.push({"role" : chat.role, "content" : chat.content + chat.attachments.map((text, index) => `\n\ndocument_${index}: \`\`\`${text}\`\`\``).join('')});
        }else{
            msgHistory.push({"role" : chat.role, "content" : chat.content});
        } 
    }

    try {
        fetch(`${FLASK_PROXY}/openAI/postMessage`, { 
            method: "POST",
            body: JSON.stringify({"chatHistory": msgHistory, "model": model}),
            headers: {
            'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory))
            .catch((error) => {
                console.error('Fetch error:', error);
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        //nothing
    }
    
    return;
}