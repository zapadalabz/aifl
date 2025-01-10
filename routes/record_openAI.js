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


recordOPENAIRoutes.route("/openAI/postChat").post(async function (req, response) {
    //chatHistory contains system message
    let chatHistory = req.body.chatHistory;
    let currentModel = req.body.model;
    let temperature = req.body.temperature;
    let resource = OPENAI_RESOURCE;
    let api_key = OPENAI_KEY;

    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const openai = new OpenAI({
        apiKey: api_key,
        baseURL: `https://${resource}.openai.azure.com/openai/deployments/${currentModel}`,
        defaultQuery: { 'api-version': apiVersion },
        defaultHeaders: { 'api-key': api_key },
    });
    

    try {
        const stream = await openai.chat.completions.create({
            model: currentModel,
            messages: chatHistory,
            stream: true,
            temperature: temperature,
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


recordOPENAIRoutes.route("/openAI/postChatNoStream").post(async (req, response) => {
    //chatHistory contains system message
    const chatHistory = req.body.chatHistory;
    const currentModel = req.body.model;
    const temperature = req.body.temperature;
    //console.log(req.body.temperature);
    
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
            temperature: temperature,
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
                    roleInformation: messages[0].content,
                    inScope: false,
                },
              ],
            },
          });
          for await (const event of events) {
            for (const choice of event.choices) {
              const newText = choice.delta?.content;
              //console.log(choice);
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

recordOPENAIRoutes.route("/openAI/postChatAzureSearchNoStream").post(async function (req, response) {
    //chatHistory contains system message
    let messages = req.body.chatHistory;
    let currentModel = req.body.model;
    let searchIndex = req.body.searchIndex;
    
    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const client = new OpenAIClient(`https://${OPENAI_RESOURCE}.openai.azure.com`, new AzureKeyCredential(OPENAI_KEY));
    //console.log(messages);
    try {
        const events = await client.streamChatCompletions(currentModel, messages, { 
            maxTokens: 4000,
            azureExtensionOptions: {
              extensions: [
                {
                    type: "AzureCognitiveSearch",
                    endpoint: AZURE_SEARCH_SERVICE_ENDPOINT,
                    key: AZURE_SEARCH_SERVICE_ADMIN_KEY,
                    indexName: searchIndex,
                    roleInformation: messages[0].content,
                    inScope: false,
                },
              ],
            },
          });
          let finalText = "";
          for await (const event of events) {
            for (const choice of event.choices) {
              const newText = choice.delta?.content;
              //console.log(choice);
              if (!!newText) {
                finalText += newText;
                //response.write(newText || '');
                // To see streaming results as they arrive, uncomment line below
                // console.log(newText);
              }
            }
          }
          response.send({"message": finalText});
        
    } catch (error) {
        console.error(error);
        response.status(500).send('Error generating text');
    }
});

module.exports = recordOPENAIRoutes;