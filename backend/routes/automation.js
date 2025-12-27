// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// router.post("/", async (req, res) => {
//   const { userName, userEmail, resumeText, jobTitle } = req.body;

//   if (!userName || !userEmail || !resumeText || !jobTitle) {
//     return res.status(400).json({ success: false, message: "Missing required fields." });
//   }

//   try {
//     // Step 1: Generate cold email using OpenRouter
//     const openrouterRes = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
// //        model: "openchat/openchat-3.5-0106"
//         model: "mistralai/mistral-7b-instruct", // ✅ stable, open-access model

//         messages: [
//           {
//             role: "system",
//             content: "You are an expert assistant that writes professional job application emails.",
//           },
//           {
//             role: "user",
//             content: `Generate a cold email for a candidate named ${userName} who wants to apply for a ${jobTitle} role. Here's their resume info:\n${resumeText}`,
//           },
//         ],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           "HTTP-Referer": "http://localhost:3000", // REQUIRED by OpenRouter
//         },
//       }
//     );

//     const emailBody = openrouterRes.data.choices[0].message.content;

//     // Step 2: Send the email using nodemailer
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "team.buddy.bots@gmail.com",       // Your Gmail
//         pass: "jspiyelmdyncoeqv",             // Your app-specific password
//       },
//     });

    

//     // const mailOptions = {
//     //   from: "team.buddy.bots@gmail.com",
//     //   to: userEmail,
//     //   subject: `Job Application - ${jobTitle}`,
//     //   text: emailBody,
//     // };

//         const mailOptions = {
//         from: `"${userName}" <team.buddy.bots@gmail.com>`, // Display user's name
//         to: userEmail, // Or the recruiter email if you are sending to someone else
//         subject: `Job Application - ${jobTitle}`,
//         text: emailBody,
//         replyTo: userEmail, // So replies go to the user!
//       };


//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ success: true, message: "Email sent", email: emailBody });
//   } catch (err) {
//     console.error("Automation error:", err.response?.data || err.message);
//     res.status(500).json({ success: false, error: "Failed to send email." });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { userName, userEmail, resumeText, jobTitle } = req.body;

  if (!userName || !userEmail || !resumeText || !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  try {
    /* =========================
       1️⃣ Generate email via OpenRouter
    ========================= */
    const openrouterRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are an expert assistant that writes professional job application emails.",
          },
          {
            role: "user",
            content: `Generate a cold email for a candidate named ${userName} who wants to apply for a ${jobTitle} role. Resume:\n${resumeText}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL, // ✅ from ENV
        },
      }
    );

    const emailBody =
      openrouterRes.data?.choices?.[0]?.message?.content;

    if (!emailBody) {
      throw new Error("Failed to generate email content");
    }

    /* =========================
       2️⃣ Send email via Nodemailer
    ========================= */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ ENV
        pass: process.env.EMAIL_PASS, // ✅ ENV
      },
    });

    const mailOptions = {
      from: `"${userName}" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Job Application - ${jobTitle}`,
      text: emailBody,
      replyTo: userEmail,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      email: emailBody,
    });
  } catch (err) {
    console.error(
      "❌ Automation error:",
      err.response?.data || err.message
    );

    res.status(500).json({
      success: false,
      error: "Failed to send email",
    });
  }
});

module.exports = router;
