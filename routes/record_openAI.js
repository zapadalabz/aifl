const express = require("express");
const OpenAI = require("openai");
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require("dotenv").config();

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordOPENAIRoutes = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
const OPENAI_RESOURCE = process.env.OPENAI_RESOURCE;

//const model = "GPT35_16K";//process.env.OPENAI_DEPLOYMENT;
const apiVersion = process.env.OPENAI_API_VERSION;

const AZURE_SEARCH_SERVICE_ADMIN_KEY = process.env.AZURE_SEARCH_SERVICE_ADMIN_KEY;
const AZURE_SEARCH_SERVICE_ENDPOINT = process.env.AZURE_SEARCH_SERVICE_ENDPOINT;

const deploymentId = process.env.OPENAI_DEPLOYMENT;


/*
// This section will help you get a list of all the records.
recordOPENAIRoutes.route("/openAI/:prompt").get(async function (req, response) {
    console.log("here");
    let prompt = req.params.prompt;
    let systemMessage = "You are an experienced teacher helping fellow colleagues."
    let messages = [{"role" : "system", "content" : systemMessage},];
    let chatHistory = [{ role: 'user', content: prompt }];

    messages = messages.concat(chatHistory);

    //console.log('Non-streaming:');
    try {
        const result = await openai.chat.completions.create({
            model,
            messages: messages,
        });
        response.write(result.choices[0].message?.content);
        //console.log(result.choices[0].message?.content);
        response.end();
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }  
  });

  // This section will help you get a list of all the records.
recordOPENAIRoutes.route("/openAI/chat/:chatHistory").get(async function (req, response) {
    
    let systemMessage = "You are an experienced teacher helping fellow colleagues."
    let messages = [{"role" : "system", "content" : systemMessage},];
    let chatHistory = JSON.parse(decodeURIComponent(req.params.chatHistory));

    messages = messages.concat(chatHistory);
    //console.log(messages);

    //console.log('Non-streaming:');
    try {
        const result = await openai.chat.completions.create({
            model,
            messages: messages,
        });
        response.write(result.choices[0].message?.content);
        //console.log(result.choices[0].message?.content);
        response.end();
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }  
  });

//Post Request

recordOPENAIRoutes.route("/openAI/post").post(async function (req, response) {
    let systemMessage = "You are an experienced teacher helping fellow colleagues."
    let messages = [{"role" : "system", "content" : systemMessage},];
    let prompt = decodeURIComponent(req.body.prompt);
    //console.log(req.body.prompt);
    let chatHistory = [{ role: 'user', content: prompt }];
    //let chatHistory = JSON.parse(decodeURIComponent(req.body.chatHistory));

    messages = messages.concat(chatHistory);
    //console.log(messages);

    //console.log('Non-streaming:');
    try {
        const result = await openai.chat.completions.create({
            model,
            messages: messages,
        });
        response.write(result.choices[0].message?.content);
        //console.log(result.choices[0].message?.content);
        response.end();
    } catch (error) {
        console.error(error);
        response.status(500).send(error);
    } 
});*/

recordOPENAIRoutes.route("/openAI/postChat").post(async function (req, response) {
    //chatHistory contains system message
    let chatHistory = req.body.chatHistory;
    let currentModel = req.body.model;
    
    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const openai = new OpenAI({
        apiKey: OPENAI_KEY,
        baseURL: `https://${OPENAI_RESOURCE}.openai.azure.com/openai/deployments/${currentModel}`,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': OPENAI_KEY },
    });

    try {
        const stream = await openai.chat.completions.create({
            model: currentModel,
            messages: chatHistory,
            stream: true,
        });

        for await (const chunk of stream){
            response.write(chunk.choices[0]?.delta?.content || '');
        }
        response.end();
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }
});


recordOPENAIRoutes.route("/openAI/postChatNoStream").post(async function (req, response) {
    //chatHistory contains system message
    let chatHistory = req.body.chatHistory;
    let currentModel = req.body.model;
    //console.log(chatHistory);
    
    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const openai = new OpenAI({
        apiKey: OPENAI_KEY,
        baseURL: `https://${OPENAI_RESOURCE}.openai.azure.com/openai/deployments/${currentModel}`,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': OPENAI_KEY },
    });

    try {
        const result = await openai.chat.completions.create({
            model: currentModel,
            messages: chatHistory,
            stream: false,
        });

        //response.write(result.choices[0].message?.content);
        //console.log(result.choices[0].message?.content);
        response.send({"message": result.choices[0].message?.content});
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }
});

recordOPENAIRoutes.route("/openAI/postChatAzureSearch").post(async function (req, response) {
    //chatHistory contains system message
    let messages = req.body.chatHistory;
    let currentModel = req.body.model;
    let searchIndex = req.body.searchIndex;
    
    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const client = new OpenAIClient(`https://${OPENAI_RESOURCE}.openai.azure.com`, new AzureKeyCredential(OPENAI_KEY));
    //console.log(messages);
    try {
        const events = await client.streamChatCompletions(currentModel, messages, { 
            maxTokens: 1024,
            azureExtensionOptions: {
              extensions: [
                {
                    type: "AzureCognitiveSearch",
                    endpoint: AZURE_SEARCH_SERVICE_ENDPOINT,
                    key: AZURE_SEARCH_SERVICE_ADMIN_KEY,
                    indexName: searchIndex,
                },
              ],
            },
          });
          for await (const event of events) {
            for (const choice of event.choices) {
              const newText = choice.delta?.content;
              if (!!newText) {
                response.write(newText || '');
                // To see streaming results as they arrive, uncomment line below
                // console.log(newText);
              }
            }
          }
          response.end();
        
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }
});

module.exports = recordOPENAIRoutes;