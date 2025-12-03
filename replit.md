# Node.js Gemini AI Backend

## Overview
A Node.js backend API that connects to Google's Gemini AI for generating responses.

## Recent Changes
- **November 30, 2025**: Updated to Gemini AI backend with /ask endpoint

## Project Architecture
- **index.js**: Express server with POST /ask endpoint for Gemini AI queries
- **package.json**: Node.js dependencies and scripts (ES modules)
- Server runs on port 5000

## Dependencies
- Express 4.18.2: Web framework
- node-fetch 3.3.2: HTTP client for API calls
- cors 2.8.5: Cross-origin resource sharing

## Environment Variables
- GEMINI_API_KEY: Google Gemini API key (required)

## API Endpoints
- POST /ask - Send a question to Gemini AI
  - Body: { "question": "Your question here" }
  - Returns: Gemini AI response

- POST /tts - Text-to-Speech with Gemini
  - Body: { "text": "Text to convert to speech" }
  - Returns: { "audio": "base64_encoded_audio_data" }
  - Audio format: PCM (24kHz, mono)

## Running the Application
The application starts automatically via the configured workflow.
