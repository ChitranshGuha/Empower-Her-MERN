// pages/api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message, history, pageContext } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ message: 'API key not configured' });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    let prompt = message; // Default prompt is just the user's message

    // Construct the prompt with page context if available, and add behavioral instructions
    if (pageContext) {
      prompt = `You are an AI assistant for a website.
      The user interacting with you is already on the website.
      DO NOT mention the technology stack (like Next.js, React, Node.js, etc.) used to build this website.
      Your primary goal is to guide the user on how to use the website, answer their questions about its content or features, and explain parts of the current page if asked.
      Always be helpful and concise.

      Given the following context from the current web page:
      ---
      Page Title: ${pageContext.title}
      Page Description: ${pageContext.description}
      Relevant Text Snippet: ${pageContext.textContent}
      ---
      User's question: ${message}`;
    } else {
      // If no page context, still set the persona and rules
      prompt = `You are an AI assistant for a website.
      The user interacting with you is already on the website.
      DO NOT mention the technology stack (like Next.js, React, Node.js, etc.) used to build this website.
      Your primary goal is to guide the user on how to use the website and answer their questions about its content or features.
      Always be helpful and concise.

      User's question: ${message}`;
    }

    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();

    res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.response && error.response.status) {
      console.error('Google API Error Response:', error.response.data);
    }
    res.status(500).json({ message: 'Error processing your request with AI.', error: error.message });
  }
}