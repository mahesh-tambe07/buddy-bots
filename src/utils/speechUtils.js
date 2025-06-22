// utils/speechUtils.js
export const speak = (text, language, voiceRef) => {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  if (language === "hi") {
    utter.lang = "hi-IN";
    utter.voice = voices.find((v) => v.lang === "hi-IN") || voices.find((v) => v.name.includes("Google हिन्दी"));
  } else if (language === "mr") {
    utter.lang = "mr-IN";
    utter.voice = voices.find((v) => v.lang.includes("hi-IN")) || voices.find((v) => v.name.includes("Google हिन्दी"));
  } else {
    utter.lang = "en-IN";
    utter.voice = voices.find((v) => v.lang === "en-IN") || voices.find((v) => v.name.includes("Google UK English"));
  }

  utter.onstart = () => {
    if (voiceRef.current) voiceRef.current.style.display = "block";
  };
  utter.onend = () => {
    if (voiceRef.current) voiceRef.current.style.display = "none";
  };

  window.speechSynthesis.speak(utter);
};

export const wishMe = (language, speak, voiceRef) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? language === "hi"
        ? "सुप्रभात सर"
        : language === "mr"
        ? "शुभ प्रभात सर"
        : "Good Morning Sir"
      : hour < 16
      ? language === "hi"
        ? "नमस्ते सर"
        : language === "mr"
        ? "नमस्कार सर"
        : "Good Afternoon Sir"
      : language === "hi"
      ? "शुभ संध्या सर"
      : language === "mr"
      ? "शुभ संध्याकाळ सर"
      : "Good Evening Sir";

  speak(greeting, language, voiceRef);
};
