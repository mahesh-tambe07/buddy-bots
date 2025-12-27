// // components/ProfileMenu.js
// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";

// const ProfileMenu = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [user, setUser] = useState({ name: "", email: "" });

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   return (
//     <div className="profile-dropdown" onClick={toggleDropdown}>
//       <div className="profile">
//         <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff", fontSize: "28px" }} />
//       </div>

//       {showDropdown && (
//         <div className="dropdown-menu">
//           <div className="dropdown-header">
//             <FontAwesomeIcon icon={faUser} style={{ marginRight: "6px", color: "#00f7ff" }} />
//             <strong>{user.name || "User"}</strong>
//           </div>
//           <div className="dropdown-subtext">{user.email || "user@example.com"}</div>
//           <hr className="dropdown-divider" />
//           <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileMenu;


// components/ProfileMenu.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    // Remove only the user key
    localStorage.removeItem("user");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <div className="profile-dropdown">
      <div className="profile" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faUser} style={{ color: "#ffffff", fontSize: "28px" }} />
      </div>

      {showDropdown && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "6px", color: "#00f7ff" }} />
            <strong>{user.name || "User"}</strong>
          </div>
          <div className="dropdown-subtext">{user.email || "user@example.com"}</div>
          <hr className="dropdown-divider" />
          <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
