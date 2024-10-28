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
        alert(`Error: ${err.message}`);
        toast.error(err.message);
    } finally {
        //nothing
    }
    
    return;
}

export async function ProcessComments(comments, token, handleCommentsUpdate) {
    const arrayComments = comments.split("\n");
    const filteredComments = arrayComments.filter(comment => comment.trim() !== "");
    const commentsWithDetails = filteredComments.map(comment => ({
        "Name": "",
        "Length": comment.length,
        "Style-Guide": {},
        "Further Considerations": ""
    }));
    handleCommentsUpdate(commentsWithDetails);
    const categoryMessage = {
        "Style-Guide": "You are a meticulous editor that is very experienced with the Canadian Press style guide. The user will provide you with a list of students comments.",
        "Further Considerations": "You are a meticulous editor who is helping out with a list of report card comments. Check that the comment is written in a caring and supportive tone. Indicate if there is no mention of student strengths and/or actionable next steps, and if personal or judgement based comments or phrases like 'Congratulations' or 'Keep up the good work' are used."
    };

    const processBatch = async (batch, category, token) => {
        /*const systemMessage = `You are a professional editor who is helping out by listing suggested edits.
        The user will provide a list of comments that need to be carefully looked over, line-by-line. 
        In this round of edits, ${categoryMessage[category]}.
        If there are no suggestions for the comment, then the JSON value should be NONE.
        Only return an array of JSON objects [{"Name": , ${category}:"List of edits"}...].`;
        */
        let systemMessage = `${categoryMessage[category]}
        If there are no suggestions for the comment, then the JSON value should be NONE.
        Only return an array of JSON objects [{"Name": , ${category}:"Considerations"}...]. Thank you.`;
        if (category === "Style-Guide") {
            systemMessage = `${categoryMessage[category]}
            Only return an array of JSON objects [{"Name": ,${category}: {"Edited Comment": , "Changes Made": }}...]. Thank you.`;
        }
       

        const msg = [{ "role": "system", "content": systemMessage }];
        const model = 'gpt-4o-mini';
        msg.push({ "role": "user", "content": JSON.stringify(batch) });
        //console.log(msg);
    
        try {
            const output = await fetch(`${PROXY}/openAI/postChatNoStream`, {
                method: "POST",
                body: JSON.stringify({ "chatHistory": msg, "model": model, "temperature": 0 }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).catch((error) => {
                toast.error(error.toString());
            });
    
            if (!output) {
                throw new Error("No output from fetch call");
            }
    
            const result = await output.json();
            const message = result.message.replace(/\n/g, '');

            const regex = /^```json([\s\S]*?)```$/;
            // Extract the JSON string using the regular expression
            const match = message.match(regex);
            // Parse the message to extract the array of JSON objects
            let jsonArray;
            if(match === null){
                try {
                    jsonArray = JSON.parse(message);
                    //console.log(jsonArray);
                } catch (err) {
                    throw new Error(`Failed to parse JSON: ${err.message}`);
                }
            }else{
                try {
                    jsonArray = JSON.parse(match[1]);
                    //console.log(jsonArray);
                } catch (err) {
                    throw new Error(`Failed to parse JSON: ${err.message}`);
                }
            }           
    
            return jsonArray;
        } catch (err) {
            alert(`Error: ${err.message}`);
            toast.error(err.message);
            return null;
        }
    };

    const batchSize = 5;
    const categories = ["Style-Guide", "Further Considerations"];
    const updatedComments = [...commentsWithDetails]; // Clone to avoid direct mutation
    for (let i = 0; i < commentsWithDetails.length; i += batchSize) {
        const batch = filteredComments.slice(i, i + batchSize);

        for (const category of categories) {
            const processedBatch = await processBatch(batch, category, token);

            if (processedBatch) {
                for(let j = 0; j < batch.length; j++){
                    updatedComments[i+j].Name = processedBatch[j].Name;
                    updatedComments[i+j][category] = processedBatch[j][category];
                }
                
            }
            //console.log(i, category);
            //console.log(updatedComments);
            handleCommentsUpdate([...updatedComments]);
        }        
    }
    return updatedComments;
}