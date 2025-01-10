const express = require('express');
const cors = require('cors');
const { videoInfo } = require('youtube-ext');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Assuming DeepSeek is a module you have installed

const app = express();
app.use(express.json());
app.use(cors());

app.post('/data', async (req, res) => {
    const genAIAPI_KEY = "your api key";
    const genAI = new GoogleGenerativeAI(genAIAPI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const tags = req.body.tags;
    console.log(tags);
    const video_link = req.query.videoUrl;
    console.log("video link is : ", video_link);
    try {
        const data = await videoInfo(video_link);
        
        const title = data?.title || "No title available";
        let description = data?.shortDescription || "No description available";
        
        if (typeof description === "string") {
            if (description.length > 250) {
                description = description.substring(0, 250);
            }
        } else {
            description = "Invalid description format.";
        }
        console.log("Video Title is : ",title);
        console.log("Video Description is : ",description);

        const prompt = `
            Your task is to classify whether a given video title is related to a specific keyword or topic. 

            Consider the following:
            1. The relationship may be direct (explicit mention of the keyword) or indirect (concepts strongly associated with the keyword, such as synonyms, related events, or popular references).
            2. Assess the context of the title and infer meaning beyond the literal words used. For example, a title about "Purpose Tour" is related to "Justin Bieber" even though his name isn’t explicitl
                
            title : ${title}
            description : ${description}
            tags : ${tags}

            Only print one word "YES" or "NO" and nothing else.
        `;

        const systemPrompt = "You are a travel agent. Be descriptive and helpful";
        const userPrompt = "Tell me about San Francisco";

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Response is : ",responseText);
        res.json({
            result: responseText
        });
    } catch (error) {
        console.error("Error occurred:", error);
        res.json({
            error: error.message
        });
    }
});
app.listen(3001, () => {    
    console.log("Server is running on port 3001");
});
