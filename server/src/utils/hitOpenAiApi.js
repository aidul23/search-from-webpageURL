// const OpenAI = require("openai");

// require("dotenv").config();

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_API_KEY,
// });

// async function hitOpenAiApi(prompt) {
//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo-16k',
//     stream: false,
//     temperature: 0.5,
//     messages: [
//       {
//         role: 'system',
//         content: 'You are a helpful assistant.',
//       },
//       {
//         role: 'user',
//         content: prompt,
//       },
//     ],
//   })

//   console.log(response?.data?.choices[0]);

//   //console.log('response', response?.data?.choices[0]?.message?.content)
//   return response?.data?.choices[0]?.message?.content
// }

// module.exports = { hitOpenAiApi }

const OpenAI = require("openai");
const fs = require("fs");

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

async function hitOpenAiApi(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      stream: false,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("Full response:", response); // Inspect the full response structure
    const messageContent = response.choices[0]?.message?.content;

    console.log("Extracted response:", messageContent);

    return messageContent; // Safely extract and return the content
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    throw new Error("Failed to fetch response from OpenAI API");
  }
}

// async function transcribeAudio(filePath) {
//   try {
//     const transcriptionResponse = await openai.audio.transcription.create({
//       file: fs.createReadStream(filePath),
//       model: "whisper-1",
//     });

//     const transcription = transcriptionResponse.text;
//     console.log("Transcription:", transcription);

//     return transcription;
//   } catch (error) {
//     console.error("Error during audio transcription:", error.message);
//     throw new Error("Failed to transcribe audio");
//   }
// }

async function transcribeAudio(filePath) {
  try {
    console.log("Attempting to transcribe file:", filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "json",
      language: "en"  // Specify the language if known, or remove this line for auto-detection
    });

    console.log("OpenAI API Response:", transcriptionResponse);

    const transcription = transcriptionResponse.text;
    
    console.log("Transcription:", transcription);

    return transcription;
  } catch (error) {
    console.error("Error during audio transcription:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

module.exports = { hitOpenAiApi, transcribeAudio };
