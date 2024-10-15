import { PROXY } from './config';
import { toast } from 'react-toastify';

async function handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory, setIsThinking) {
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
                setIsThinking(false);
                break;
            }

            // Process the received chunk of text
            partialText += decoder.decode(value);

            chatHistory[lengthChatHistory-1].content = partialText;
            //console.log(partialText);
            setChatHistory([...chatHistory]);
        }
        
    } catch (error) {
        toast.error(error.toString());
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


export async function postOpenAIResponse(chatHistory, setChatHistory, setIsThinking){
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
            .then((response)=>handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory, setIsThinking))
            .catch((error) => {
                toast.error(error.toString());
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
        toast.error(err.message);
    } finally {
        //nothing
    }
    
    return;
}


export async function postOpenAIChatResponse(chatHistory, setChatHistory, model, token, chatSettings, setIsThinking){
    const lengthChatHistory = chatHistory.length;
    
    //let systemMessage = `You are an experienced teacher that repsonds using Markdown.`; 
    //If you need to write an equation, then wrap it in $ symbols. For example, $x^2 + y^2 = r^2$.`;
    let system_message = chatSettings.system_message;
    if (system_message === ""){
        system_message = "You are an experienced teacher who loves helping out.";
        localStorage.setItem('chatSettings',JSON.stringify({...chatSettings, "system_message": system_message}));
    }
    let msgHistory = [{"role" : "system", "content" : system_message}]; //Include the attachments into the history

    for(let i = 0; i < lengthChatHistory-1; i++){
        let chat = chatHistory[i];
        if(chat.role === "user"){
            if(chat.img === ""){
                msgHistory.push({"role" : chat.role, "content" : chat.content + chat.attachments.map((text, index) => `\n\ndocument_${index}: \`\`\`${text}\`\`\``).join('')});
            }else{
                const chatContent = [
                    {"type": "text", "text": chat.content + chat.attachments.map((text, index) => `\n\ndocument_${index}: \`\`\`${text}\`\`\``).join('')},
                    {"type": "image_url", "image_url": {
                        "url": `${chat.img}`}
                    }
                ];
                msgHistory.push({"role" : chat.role, "content" : chatContent});
            }
            }else{
            msgHistory.push({"role" : chat.role, "content" : chat.content});
        } 
    }

    try {
        fetch(`${PROXY}/openAI/postChat`, { 
            method: "POST",
            body: JSON.stringify({"chatHistory": msgHistory, "model": model, "temperature": chatSettings.temperature}),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}:${response.statusText}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory, setIsThinking))
            .catch((error) => {
                toast.error(error.toString());
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
        toast.error(err.message);
    } finally {
        //nothing
    }
    
    return;
}

export async function postOpenAIChatResponseAzureSearch(chatHistory, setChatHistory, model, token, searchIndex, setIsThinking){
    const lengthChatHistory = chatHistory.length;
    
    let systemMessage = `You are an experienced teacher.
    If you need to write an equation, then wrap it in $ symbols. For example, $x^2 + y^2 = r^2$`;
    let msgHistory = [{role : "system", content: systemMessage}];

    for(let i = 0; i < lengthChatHistory-1; i++){
        let chat = chatHistory[i];
        if(chat.role === "user"){
            msgHistory.push({role : chat.role, content: chat.content + chat.attachments.map((text, index) => `\n\ndocument_${index}: \`\`\`${text}\`\`\``).join('')});
        }else{
            msgHistory.push({role : chat.role, content: chat.content});
        } 
    }
    //console.log(token);
    try {
        fetch(`${PROXY}/openAI/postChatAzureSearch`, { 
            method: "POST",
            body: JSON.stringify({"chatHistory": msgHistory, "model": model, "searchIndex": searchIndex}),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}:${response.statusText}`);
                }
                return response;
            })
            .then((response)=>handleStreamedResponseMessages(response, chatHistory, setChatHistory, lengthChatHistory, setIsThinking))
            .catch((error) => {
                toast.error(error.toString());
            });        
        
    } catch (err) {
        alert("Error: " + err.message);
        toast.error(err.message);
    } finally {
        //nothing
    }
    
    return;
}

export async function postGeneratePossibleComments(title, desc, token){
    
    let systemMessage = `You are an experienced teacher helping fellow colleagues to generate a list of possible comments given certain criteria. 
    Keep your response to 5 possible comments.
    In the place of a student's name use the hastag symbol #.
    Separate each comment with a line break. Do not number the comments.`;
    let msg = [{"role" : "system", "content" : systemMessage}];
    let model = 'GPT4';

    msg.push({"role" : "user", "content" : `${title} and ${desc}`});

    try {
        const output = await fetch(`${PROXY}/openAI/postChatNoStream`, { 
            method: "POST",
            body: JSON.stringify({"chatHistory": msg, "model": model}),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        }).catch((error) => {
            toast.error(error.toString());
        });
        return (await output.json()).message;      
                    
        
    } catch (err) {
        alert("Error: " + err.message);
        toast.error(err.message);
    } finally {
        //nothing
    }
    
    return;
}