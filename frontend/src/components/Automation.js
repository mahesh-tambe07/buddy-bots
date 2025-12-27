// // components/Automation.js

// import React, { useEffect, useRef, useState } from "react";
// import voiceGif from "../assets/voice.gif";
// import micIcon from "../assets/mic.svg";
// import logo from "../assets/logo.jpg";
// import "../App.css";
// import axios from "axios";
// import { speak, wishMe } from "../utils/speechUtils";
// import LanguageSelector from "./LanguageSelector";
// import ProfileMenu from "./ProfileMenu";

// const Automation = () => {
//   const voiceRef = useRef(null);
//   const recognitionRef = useRef(null);

//   const [isListening, setIsListening] = useState(false);
//   const [language, setLanguage] = useState("en");
//   const [selectedLanguage, setSelectedLanguage] = useState("English");
//   const [reply, setReply] = useState("");
//   const [resumeText, setResumeText] = useState("");

//   const [userName] = useState("Mahesh Tambe");
//   const [userEmail, setUserEmail] = useState("");
// //  const [jobTitle, setJobTitle] = useState("Software Developer");
//   const jobTitle = "Software Developer";


//   useEffect(() => {
//     speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
//     wishMe(language, speak, voiceRef);
//   }, [language]);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       setReply("Unsupported file type.");
//       speak("Unsupported file type. Please upload PDF or Word document.", language, voiceRef);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       const res = await axios.post("http://localhost:5000/api/parse-resume", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data?.text?.trim()) {
//         setResumeText(res.data.text);
//         setReply("Resume parsed successfully.");
//         speak("Resume parsed successfully.", language, voiceRef);
//       } else {
//         setReply("Resume parsing failed or empty.");
//         speak("Resume parsing failed or is empty.", language, voiceRef);
//       }
//     } catch (err) {
//       console.error("Resume parse error:", err);
//       setReply("Error parsing resume.");
//       speak("Error parsing resume.", language, voiceRef);
//     }
//   };

//   const handleCommand = async (command) => {
//     const lowerCmd = command.toLowerCase();
//     console.log("Voice command recognized:", lowerCmd);

//     const applyTriggers = [
//       "apply for this job",
//       "i want to apply",
//       "apply to this job",
//       "send my resume",
//       "submit my resume",
//       "send application"
//     ];

//     const matched = applyTriggers.some(trigger => lowerCmd.includes(trigger));

//     if (matched) {
//       if (!userEmail || !resumeText) {
//         const message = !userEmail
//           ? "Please enter recipient email first."
//           : "Please upload your resume first.";
//         console.warn("Missing data:", { userEmail, resumeText });
//         speak(message, language, voiceRef);
//         return;
//       }

//       speak("Sending your application email now.", language, voiceRef);

//       try {
//         const res = await axios.post("http://localhost:5000/api/automation", {
//           userName,
//           userEmail,
//           resumeText,
//           jobTitle,
//         });

//         const responseText = res.data.success
//           ? "Application email sent successfully!"
//           : "Failed to send email.";

//         setReply(responseText);
//         speak(responseText, language, voiceRef);
//       } catch (err) {
//         console.error("Email error:", err.message);
//         speak("There was an error sending the email.", language, voiceRef);
//       }
//     } else {
//       speak(
//         language === "hi"
//           ? "यह आदेश स्वीकृत नहीं है।"
//           : language === "mr"
//           ? "हा आदेश मान्य नाही."
//           : "Command not recognized for automation email.",
//         language,
//         voiceRef
//       );
//     }
//   };

//   const toggleListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!recognitionRef.current) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = false;
//     }

//     const recognition = recognitionRef.current;
//     recognition.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";

//     if (!isListening) {
//       recognition.onstart = () => {
//         setIsListening(true);
//         voiceRef.current.style.display = "block";
//         speak(
//           language === "hi"
//             ? "मैं सुन रहा हूँ"
//             : language === "mr"
//             ? "मी ऐकत आहे"
//             : "I am listening",
//           language,
//           voiceRef
//         );
//       };

//       recognition.onresult = (event) => {
//         const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
//         handleCommand(transcript);
//       };

//       recognition.onerror = (event) => {
//         console.error("Recognition error:", event.error);
//         speak(
//           language === "hi"
//             ? "फिर से बोलें।"
//             : language === "mr"
//             ? "पुन्हा बोला."
//             : "Please say that again.",
//           language,
//           voiceRef
//         );
//       };

//       recognition.onend = () => {
//         if (isListening) recognition.start();
//       };

//       recognition.start();
//     } else {
//       recognition.stop();
//       setIsListening(false);
//       voiceRef.current.style.display = "none";
//       speak(
//         language === "hi"
//           ? "सुनना बंद कर दिया गया।"
//           : language === "mr"
//           ? "ऐकणं थांबवलं."
//           : "Stopped listening.",
//         language,
//         voiceRef
//       );
//     }
//   };

//   return (
//     <div className="container">
//       <div className="stars"></div>
//       <div className="shooting-stars"></div>

//       <div className="top-bar">
//         <LanguageSelector
//           selectedLanguage={selectedLanguage}
//           setSelectedLanguage={setSelectedLanguage}
//           setLanguage={setLanguage}
//         />
//         <ProfileMenu />
//       </div>

//       <img src={logo} alt="Logo" id="logo" />
//       <h1>
//         I'm <span id="name">Vyommitra</span>, Your <span id="va">Automation Assistant</span>
//       </h1>

//       <input
//         type="email"
//         placeholder="Enter recipient email"
//         value={userEmail}
//         onChange={(e) => setUserEmail(e.target.value)}
//         style={{ padding: "8px", margin: "10px" }}
//       />

//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={handleResumeUpload}
//         style={{ padding: "8px", margin: "10px" }}
//       />

//       {resumeText && (
//         <div style={{ marginTop: "10px", padding: "10px", maxWidth: "90%" }}>
//           <strong>Parsed Resume:</strong>
//           <textarea
//             rows={6}
//             value={resumeText}
//             readOnly
//             style={{ width: "100%", marginTop: "5px", fontSize: "0.9rem" }}
//           />
//         </div>
//       )}

//       <img ref={voiceRef} src={voiceGif} alt="voice" id="voice" style={{ display: "none" }} />

//       <button id="btn" onClick={toggleListening}>
//         <img src={micIcon} alt="mic" style={{ width: "24px", height: "24px" }} />
//         <span id="content">{isListening ? "Listening... Click to Stop" : "Click to Talk With Me"}</span>
//       </button>

//       {reply && (
//         <div className="response-box">
//           <strong>Vyommitra:</strong> {reply}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Automation;


// components/Automation.js

import React, { useEffect, useRef, useState } from "react";
import voiceGif from "../assets/voice.gif";
import micIcon from "../assets/mic.svg";
import logo from "../assets/logo.jpg";
import "../App.css";
import axios from "axios";
import { speak, wishMe } from "../utils/speechUtils";
import LanguageSelector from "./LanguageSelector";
import ProfileMenu from "./ProfileMenu";

const Automation = () => {
  const voiceRef = useRef(null);
  const recognitionRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [reply, setReply] = useState("");
  const [resumeText, setResumeText] = useState("");

  // ✅ USER DETAILS FROM STORAGE
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "Candidate";

  const [userEmail, setUserEmail] = useState("");
  const jobTitle = "Software Developer";

  // ✅ BACKEND BASE URL
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    wishMe(language, speak, voiceRef);
  }, [language]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setReply("Unsupported file type.");
      speak(
        "Unsupported file type. Please upload PDF or Word document.",
        language,
        voiceRef
      );
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        `${API_URL}/api/parse-resume`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.text?.trim()) {
        setResumeText(res.data.text);
        setReply("Resume parsed successfully.");
        speak("Resume parsed successfully.", language, voiceRef);
      } else {
        setReply("Resume parsing failed or empty.");
        speak("Resume parsing failed or is empty.", language, voiceRef);
      }
    } catch (err) {
      console.error("Resume parse error:", err);
      setReply("Error parsing resume.");
      speak("Error parsing resume.", language, voiceRef);
    }
  };

  const handleCommand = async (command) => {
    const lowerCmd = command.toLowerCase();
    console.log("Voice command recognized:", lowerCmd);

    const applyTriggers = [
      "apply for this job",
      "i want to apply",
      "apply to this job",
      "send my resume",
      "submit my resume",
      "send application",
    ];

    const matched = applyTriggers.some((t) => lowerCmd.includes(t));

    if (matched) {
      if (!userEmail || !resumeText) {
        const message = !userEmail
          ? "Please enter recipient email first."
          : "Please upload your resume first.";

        speak(message, language, voiceRef);
        return;
      }

      speak("Sending your application email now.", language, voiceRef);

      try {
        const res = await axios.post(`${API_URL}/api/automation`, {
          userName,
          userEmail,
          resumeText,
          jobTitle,
        });

        const responseText = res.data?.success
          ? "Application email sent successfully!"
          : "Failed to send email.";

        setReply(responseText);
        speak(responseText, language, voiceRef);
      } catch (err) {
        console.error("Email error:", err);
        speak("There was an error sending the email.", language, voiceRef);
      }
    } else {
      speak(
        language === "hi"
          ? "यह आदेश स्वीकृत नहीं है।"
          : language === "mr"
          ? "हा आदेश मान्य नाही."
          : "Command not recognized for automation email.",
        language,
        voiceRef
      );
    }
  };

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
    }

    const recognition = recognitionRef.current;
    recognition.lang =
      language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";

    if (!isListening) {
      recognition.onstart = () => {
        setIsListening(true);
        voiceRef.current.style.display = "block";
        speak(
          language === "hi"
            ? "मैं सुन रहा हूँ"
            : language === "mr"
            ? "मी ऐकत आहे"
            : "I am listening",
          language,
          voiceRef
        );
      };

      recognition.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        handleCommand(transcript);
      };

      recognition.onerror = () => {
        speak(
          language === "hi"
            ? "फिर से बोलें।"
            : language === "mr"
            ? "पुन्हा बोला."
            : "Please say that again.",
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
          ? "सुनना बंद कर दिया गया।"
          : language === "mr"
          ? "ऐकणं थांबवलं."
          : "Stopped listening.",
        language,
        voiceRef
      );
    }
  };

  return (
    <div className="container">
      <div className="stars"></div>
      <div className="shooting-stars"></div>

      <div className="top-bar">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setLanguage={setLanguage}
        />
        <ProfileMenu />
      </div>

      <img src={logo} alt="Logo" id="logo" />
      <h1>
        I'm <span id="name">Vyommitra</span>, Your{" "}
        <span id="va">Automation Assistant</span>
      </h1>

      <input
        type="email"
        placeholder="Enter recipient email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        style={{ padding: "8px", margin: "10px" }}
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleResumeUpload}
        style={{ padding: "8px", margin: "10px" }}
      />

      {resumeText && (
        <div style={{ marginTop: "10px", padding: "10px", maxWidth: "90%" }}>
          <strong>Parsed Resume:</strong>
          <textarea
            rows={6}
            value={resumeText}
            readOnly
            style={{ width: "100%", marginTop: "5px", fontSize: "0.9rem" }}
          />
        </div>
      )}

      <img
        ref={voiceRef}
        src={voiceGif}
        alt="voice"
        id="voice"
        style={{ display: "none" }}
      />

      <button id="btn" onClick={toggleListening}>
        <img
          src={micIcon}
          alt="mic"
          style={{ width: "24px", height: "24px" }}
        />
        <span id="content">
          {isListening ? "Listening... Click to Stop" : "Click to Talk With Me"}
        </span>
      </button>

      {reply && (
        <div className="response-box">
          <strong>Vyommitra:</strong> {reply}
        </div>
      )}
    </div>
  );
};

export default Automation;
