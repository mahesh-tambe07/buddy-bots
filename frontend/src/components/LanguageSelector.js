// components/LanguageSelector.js
import React, { useState } from "react";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage, setLanguage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (lang) => {
    setSelectedLanguage(lang);
    setDropdownOpen(false);
    const langCode = lang === "Hindi" ? "hi" : lang === "Marathi" ? "mr" : "en";
    setLanguage(langCode);
  };

  return (
    <div className="language-selector">
      <button onClick={() => setDropdownOpen(!dropdownOpen)}>🌐 {selectedLanguage}</button>
      {dropdownOpen && (
        <div className="dropdown-content">
          <button onClick={() => handleSelect("English")}>English</button>
          <button onClick={() => handleSelect("Hindi")}>हिंदी</button>
          <button onClick={() => handleSelect("Marathi")}>मराठी</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
