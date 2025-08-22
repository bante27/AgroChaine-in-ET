// controllers/chatController.js
// Live Chat Controller (ES Module)

// Named export for ES Module import
export const chatBotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Simple logic or replace with AI later
    let response = "I didn't understand that.";

    const lower = message.toLowerCase();

    if (lower.includes("hello")) {
      response = "Hi there! How can I assist you today?";
    } else if (lower.includes("bye")) {
      response = "Goodbye! Have a nice day!";
    } else if (lower.includes("help")) {
      response = "Sure, I'm here to help. What do you need assistance with?";
    }

    // Respond with the bot message
    return res.status(200).json({ reply: response });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({ error: "Server error in chat controller" });
  }
};
