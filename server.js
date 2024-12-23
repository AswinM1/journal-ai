import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk"; // Import Groq SDK
import cors from "cors"; // Optional, for CORS if needed

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests (if needed)
app.use(express.json()); // Parse incoming JSON requests

// Initialize Groq with your API key
const groq = new Groq({
  apiKey: process.env.KEY, // Replace with your Groq API key from .env
});

app.get("/", (req, res) => {
  res.send("Hello");
  console.log("Server started");
});

app.post("/main", async (req, res) => {
  try {
    const data = req.body.input;

    if (!data) {
      return res.status(400).json({ error: "Input is required" });
    }

    // Log the incoming input for debugging
    console.log("User input:", data);

    const responsechat = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You act as an assistant to write a journal for the users, understand their emotions, and provide advice. If their mood is sad, make them happy.",
        },
        {
          role: "user",
          content: data, // Use the correct variable
        },
      ],
      model: "llama3-8b-8192",
    });

    // Log the response for debugging
    console.log("Response from Groq:", responsechat);

    // Send the response back to the client
    res.status(200).json({ reply: responsechat });
  } catch (error) {
    console.error("Error occurred:", error.message, error.stack);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
