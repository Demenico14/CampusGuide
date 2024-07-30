import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import punycode from 'punycode'; // Import the punycode library

dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY, // Replace with secure environment variable
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CampusGuide!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

// Example usage of punycode
app.get('/punycode-example', (req, res) => {
  const domain = 'xn--ls8h.xn--3e0b707e'; // Example Punycode string
  const decoded = punycode.decode(domain);
  res.status(200).send({ decoded });
});

app.listen(5001, () => console.log('AI server started on http://localhost:5001'));
