// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Dashboard from './pages/Dashboard';
import Assistant from './components/Assistant';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatBot from './components/ChatBot';
import TaskManager from './components/TaskManager';
import Automation from './components/Automation';
import Reminder from './components/Reminder';

function App() {
  return (
    <GoogleOAuthProvider clientId="380766267990-n0mvq5qd9383rei6tllonpdrb05ve4t6.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/reminder" element={<Reminder />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
