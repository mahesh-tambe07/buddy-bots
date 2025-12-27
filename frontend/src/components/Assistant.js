
// components/Assistant.js
import React, { useEffect, useRef, useState } from "react";
import voiceGif from "../assets/voice.gif";
import micIcon from "../assets/mic.svg";
import logo from "../assets/logo.jpg";
import "../App.css";
import axios from "axios";
import { speak, wishMe } from "../utils/speechUtils";
import LanguageSelector from "./LanguageSelector";
import ProfileMenu from "./ProfileMenu";

const Assistant = () => {
  const voiceRef = useRef(null);
  const recognitionRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    wishMe(language, speak, voiceRef);
  }, [language]);

  // const handleCommand = async (command) => {
  //   const systemPrompt =
  //     language === "mr"
  //       ? "तू एक उपयुक्त सहाय्यक आहेस. वापरकर्त्याच्या प्रश्नांना मराठीत उत्तर दे."
  //       : language === "hi"
  //       ? "आप एक सहायक हैं। उपयोगकर्ता के प्रश्नों का उत्तर हिंदी में दें।"
  //       : "You are a helpful assistant. Reply in English.";

  //   try {
  //     const res = await axios.post(
  //       "https://openrouter.ai/api/v1/chat/completions",
  //       {
  //         model: "openai/gpt-3.5-turbo",
  //         messages: [
  //           { role: "system", content: systemPrompt },
  //           { role: "user", content: command },
  //         ],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
  //           "HTTP-Referer": "http://localhost:3000",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const reply = res.data.choices[0].message.content;
  //     speak(reply, language, voiceRef);
  //   } catch (err) {
  //     console.error("API Error:", err.response?.data || err.message);
  //     speak(
  //       language === "hi"
  //         ? "अभी जवाब नहीं मिल पाया।"
  //         : language === "mr"
  //         ? "आता उत्तर मिळालं नाही."
  //         : "Sorry, I couldn't get a response right now.",
  //       language,
  //       voiceRef
  //     );
  //   }
  // };  
  const handleCommand = async (command) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/chat`,
      {
        messages: [{ from: "user", text: command }],
        language, // optional if you want multilingual logic backend-side
      }
    );

    const reply = res.data.reply;
    speak(reply, language, voiceRef);

  } catch (err) {
    console.error("API Error:", err.message);
    speak(
      language === "hi"
        ? "अभी जवाब नहीं मिल पाया।"
        : language === "mr"
        ? "आता उत्तर मिळालं नाही."
        : "Sorry, I couldn't get a response right now.",
      language,
      voiceRef
    );
  }
};

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
    }

    const recognition = recognitionRef.current;
    recognition.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";

    if (!isListening) {
      recognition.onstart = () => {
        setIsListening(true);
        voiceRef.current.style.display = "block";
        speak(
          language === "hi" ? "मैं सुन रहा हूँ" : language === "mr" ? "मी ऐकत आहे" : "I am listening",
          language,
          voiceRef
        );
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        speak(
          language === "hi"
            ? "माफ़ कीजिए, दोबारा कहिए।"
            : language === "mr"
            ? "क्षमस्व, पुन्हा बोला."
            : "Sorry, I didn't catch that.",
          language,
          voiceRef
        );
      };

      recognition.onend = () => {
        if (isListening) recognition.start();
      };

      recognition.start();
    } else {
      recognition.stop();
      setIsListening(false);
      voiceRef.current.style.display = "none";
      speak(
        language === "hi"
          ? "सुनना बंद कर दिया गया"
          : language === "mr"
          ? "ऐकणं थांबवलं"
          : "Stopped listening",
        language,
        voiceRef
      );
    }
  };

  return (
    <div className="container">
      {/* 🌌 Starry Background */}
      <div className="stars"></div>
      <div className="shooting-stars"></div>

      {/* 🔝 Top Bar */}
      <div className="top-bar">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setLanguage={setLanguage}
        />
        <ProfileMenu />
      </div>

      {/* ✨ Glowing Line Under Topbar */}
      <hr className="assistant-divider" />

      {/* 🪐 Assistant Logo & Headings */}
      <img src={logo} alt="Logo" id="logo" />
      <h1>
        I'm <span id="name">Vyommitra</span>, Your <span id="va">Virtual Assistant</span>
      </h1>

      {/* 🎙️ Voice Indicator */}
      <img ref={voiceRef} src={voiceGif} alt="voice" id="voice" style={{ display: "none" }} />

      {/* 🎤 Button */}
      <button id="btn" onClick={toggleListening}>
        <img src={micIcon} alt="mic" style={{ width: "24px", height: "24px" }} />
        <span id="content">
          {isListening ? "Listening... Click to Stop" : "Click to Talk With Me"}
        </span>
      </button>
    </div>
  );
};

export default Assistant;
