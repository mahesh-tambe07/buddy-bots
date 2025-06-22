// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [user, setUser] = useState({ name: '', email: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) setUser(storedUser);
//   }, []);

//   const toggleDropdown = () => setShowDropdown(!showDropdown);
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="dashboard-wrapper">
//       <div className="stars"></div>
//       <div className="shooting-stars"></div>

//       {/* 🔝 Top Bar */}
//       <div className="top-bar">
//         <h1>
//           Welcome, <span id="name">{user.name || 'User'}</span>
//         </h1>

//         <div className="profile-dropdown" onClick={toggleDropdown}>
//           <div className="profile">
//             <FontAwesomeIcon icon={faUser} style={{ color: '#ffffff', fontSize: '28px' }} />
//           </div>

//           {showDropdown && (
//             <div className="dropdown-menu">
//               <div className="dropdown-header">
//                 <FontAwesomeIcon icon={faUser} style={{ marginRight: '6px', color: '#00f7ff' }} />
//                 <strong>{user.name}</strong>
//               </div>
//               <div className="dropdown-subtext">{user.email}</div>
//               <hr className="dropdown-divider" />
//               <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🧠 Assistant Options */}
//       <div className="assistant-cards">
//         {[
//           { title: "Chat Bot", icon: "💬", route: "/chatbot" },
//           { title: "Automation Bot", icon: "🤖", route: "/automation" },
//           { title: "Voice Assistant", icon: "🎤", route: "/assistant" },
//           { title: "Task Manager", icon: "📋", route: "/tasks" },
//           { title: "Reminder Assistant", icon: "🔔", route: "/reminder" }
//         ].map((bot, index) => (
//           <div className="assistant-card" key={index}>
//             <div className="card-content">
//               <h2>{bot.icon} {bot.title}</h2>
//               <button className="lets-go" onClick={() => navigate(bot.route)}>🚀 Let’s Go</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dash-wrapper">
      <div className="dash-stars"></div>
      <div className="dash-shooting-stars"></div>

      <div className="dash-top-bar">
        <h1>
          Welcome, <span className="dash-name">{user.name || 'User'}</span>
        </h1>

        <div className="dash-profile-dropdown" onClick={toggleDropdown}>
          <div className="dash-profile-icon">
            <FontAwesomeIcon icon={faUser} style={{ color: '#ffffff', fontSize: '28px' }} />
          </div>

          {showDropdown && (
            <div className="dash-dropdown-menu">
              <div className="dash-dropdown-header">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '6px', color: '#00f7ff' }} />
                <strong>{user.name}</strong>
              </div>
              <div className="dash-dropdown-subtext">{user.email}</div>
              <hr className="dash-dropdown-divider" />
              <div className="dash-dropdown-item" onClick={handleLogout}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>

      <div className="dash-assistant-cards">
        {[
          { title: "Chat Bot", icon: "💬", route: "/chatbot" },
          { title: "Automation Bot", icon: "🤖", route: "/automation" },
          { title: "Voice Assistant", icon: "🎤", route: "/assistant" },
          { title: "Task Manager", icon: "📋", route: "/tasks" },
          { title: "Reminder Assistant", icon: "🔔", route: "/reminder" }
        ].map((bot, index) => (
          <div className="dash-assistant-card" key={index}>
            <div className="dash-card-content">
              <h2>{bot.icon} {bot.title}</h2>
              <button className="dash-lets-go" onClick={() => navigate(bot.route)}>🚀 Let’s Go</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
