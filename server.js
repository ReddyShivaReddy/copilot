
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());


// Default page
// Define a route that responds with "Hello, World!"
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


// Filters prompts
function getFilterPrompt(filter, topic) {
    const filter_list = {
        'story': `Craft a captivating story that introduces the topic of ${topic}. Begin with an intriguing event or scenario that draws readers into the world of ${topic}.`,
        'question': `Pose a thought-provoking question related to ${topic} that sparks curiosity and encourages readers to delve deeper into the subject. Make them ponder the mysteries of ${topic}.`,
        'quotation': `Create a hook using a relevant and impactful quotation about ${topic}. This quotation should encapsulate the essence of ${topic} and set the tone for the discussion ahead.`,
        'informative': `Write an informative hook that provides a brief overview of ${topic}. Give readers a glimpse of what they can expect to learn in this article or lesson about ${topic}.`,
        'imaginative': `Transport readers to an imaginative scenario or a hypothetical world that involves ${topic}. Let your creativity run wild as you paint a vivid picture of the possibilities and wonders of ${topic}.`,
        'controversial': `Stir curiosity and engagement by introducing a controversial statement or viewpoint related to ${topic}. Challenge readers' assumptions and invite them to explore different perspectives on ${topic}.`,
        'historical': `Create a hook that can take readers on a journey through history by providing a historical perspective on ${topic}, share a key event, discovery, or figure from the past that shaped our understanding of ${topic}`,
        'statistical': `Present a surprising or compelling statistic related to ${topic}. Highlighting a fascinating data point can immediately capture readers' attention and emphasize the significance of ${topic}.`,
        
        'custom': topic
    }
    let prompt = filter_list[filter];
    if(topic.includes("light")) {
        prompt = prompt + " Take an example of cherenkov radiation."
    }
    return prompt;
}

// Set your OpenAI API key
const apiKey = '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';

// Define the API endpoint
const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';


// Define the data payload
const data = {
    temperature: 0.9,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
};

// Define the headers with your API key
const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
};


app.post('/search', (req, res) => {
    const topic = req.body['topic'];
    const filter = req.body['filter'];

    const prompt = getFilterPrompt(filter, topic);

    console.log("Output prompt is: " + prompt + "\n\n");

    data['prompt'] = prompt;

    // Make a POST request to the API
    axios.post(url, data, { headers })
        .then((response) => {
            // Extract the generated text from the response
            const generatedText = response.data.choices[0].text;

            // Print the generated text
            res.send({"output":generatedText.trim()});
        })
        .catch((error) => {
            console.error(error);
        });
});






// const sdk = require('api')('@monster-api/v1.0#jw8b10lmdb3izd');
