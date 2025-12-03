import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const interactionLogs = [];

app.post("/ask", async (req, res) => {
  const question = req.body.question;
  const timestamp = new Date().toISOString();

  const result = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    }
  );

  const data = await result.json();

  const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  interactionLogs.push({
    type: "ask",
    timestamp,
    question,
    response: aiResponse
  });

  res.send(data);
});

app.post("/tts", async (req, res) => {
  try {
    const text = req.body.text;
    const timestamp = new Date().toISOString();

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }
          }
        }
      }
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (audioData) {
      interactionLogs.push({
        type: "tts",
        timestamp,
        text,
        success: true
      });
      res.json({ audio: audioData });
    } else {
      interactionLogs.push({
        type: "tts",
        timestamp,
        text,
        success: false,
        error: "No audio generated"
      });
      res.status(500).json({ error: "No audio generated" });
    }
  } catch (err) {
    console.error("TTS error:", err);
    interactionLogs.push({
      type: "tts",
      timestamp: new Date().toISOString(),
      text: req.body.text,
      success: false,
      error: err.message
    });
    res.status(500).json({ error: "TTS failed", details: err.message });
  }
});

app.get("/logs", (req, res) => {
  res.json({
    total: interactionLogs.length,
    logs: interactionLogs
  });
});

app.delete("/logs", (req, res) => {
  interactionLogs.length = 0;
  res.json({ message: "Logs cleared" });
});

app.listen(5000, '0.0.0.0', () => console.log("Backend Gemini running on port 5000"));
