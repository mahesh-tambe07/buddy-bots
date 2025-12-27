// import React, { useState } from 'react';
// import './ChatBot.css';
// import axios from 'axios';

// const ChatBot = ({ onClose }) => {
//   const [messages, setMessages] = useState([
//     { from: 'bot', text: 'Hello! Ask me anything...' }
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { from: 'user', text: input }];
//     setMessages(newMessages);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/chat', {
//         messages: newMessages
//       });

//       console.log("✅ Full Backend Response:", response.data);

//       const reply = response?.data?.reply || "⚠️ Empty reply from backend.";
//       setMessages([...newMessages, { from: 'bot', text: reply }]);

//     } catch (error) {
//       console.error("❌ Frontend Error:", error?.response?.data || error.message);
//       setMessages([
//         ...newMessages,
//         { from: 'bot', text: '⚠️ Assistant could not respond at the moment.' }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <h3>💬 Chat Bot</h3>
//         <button className="close-btn" onClick={onClose}>×</button>
//       </div>
//       <div className="chatbot-body">
//         {messages.map((msg, idx) => (
//           <div key={idx} className={`chat-message ${msg.from}`}>
//             {msg.text}
//           </div>
//         ))}
//         {isLoading && <div className="chat-message bot">Typing...</div>}
//       </div>
//       <div className="chatbot-input">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;


import React, { useState } from 'react';
import './ChatBot.css';
import axios from 'axios';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! Ask me anything...' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Use environment variable for backend URL
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: newMessages
      });

      console.log("✅ Full Backend Response:", response.data);

      const reply = response?.data?.reply || "⚠️ Empty reply from backend.";
      setMessages([...newMessages, { from: 'bot', text: reply }]);

    } catch (error) {
      console.error("❌ Frontend Error:", error?.response?.data || error.message);
      setMessages([
        ...newMessages,
        { from: 'bot', text: '⚠️ Assistant could not respond at the moment.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>💬 Chat Bot</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="chat-message bot">Typing...</div>}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
