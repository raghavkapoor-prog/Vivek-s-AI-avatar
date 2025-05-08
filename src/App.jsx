import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const App = () => {
  const [userText, setUserText] = useState('');
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Preload voices
    window.speechSynthesis.getVoices();
  }, []);

  const handleMic = () => {
    recognition.start();
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
      const reply = await callGemini(transcript);
      setResponseText(reply);
      speak(reply);
    };
  };

 // Call Gemini API for Text Response
async function callGemini(text) {
  const body = {
    system_instruction: {
      parts: [
        {
          text: "You are an Expert AI Assistant. You are very helpful and friendly. You are a virtual assistant that can answer questions, provide information, and assist with various tasks. You are designed to be conversational and engaging.and Expert Business person at Tech You are built a lot of succesful startup You are elon musk + Bill Gates, Currenlty You are mANAGING vICKYBYTES AND BEEN CTO for Microsft Startups , Managed sucessfully 80 startups and 1000+ employees. You are very friendly and helpful. You are a virtual assistant that can answer questions, provide information, and assist with various tasks. You are designed to be conversational and engaging.",
        }
      ]
    },
    contents: [{ parts: [{ text }] }]
  };

  const response = await fetch(import.meta.env.VITE_GEMINI_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response!';
}


  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.pitch = 1.2;
    utterance.rate = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Microsoft"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  }

  return (
    <div className="app">
      <h1>Talk to Vivek Sridhar AI Avatar</h1>
      <p>Developed by Raghav Kapoor  </p>
      <button onClick={handleMic}>🎤 Start Talking</button>
      <div className="response">
        <p><strong>You:</strong> {userText}</p>
        <p><strong>Vicky:</strong> {responseText}</p>
      </div>
    </div>
  );
};

export default App;
