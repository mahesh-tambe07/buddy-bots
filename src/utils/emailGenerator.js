async function generateEmailFromResume(userName, resumeText, jobTitle) {
  if (!resumeText) {
    return `Dear Hiring Manager,\n\nI am writing to express my interest in the open position.\n\nMy name is ${userName}. I believe my skills align well with your company's needs.\n\nPlease find my resume attached. I look forward to the opportunity.\n\nRegards,\n${userName}`;
  }

  // Use OpenAI here if desired:
  // const prompt = `Write a short cold email applying for a ${jobTitle} role. Resume:\n${resumeText}`;
  // const result = await callOpenAIApi(prompt); // You'll need to implement this
  // return result;

  // Simple rule-based fallback:
  return `Dear Hiring Manager,\n\nI am excited to apply for the position of ${jobTitle}. Based on my experience: ${resumeText.slice(0, 300)}... I am confident I can contribute to your team.\n\nRegards,\n${userName}`;
}

module.exports = { generateEmailFromResume };
