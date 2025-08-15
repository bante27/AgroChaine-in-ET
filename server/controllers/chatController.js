// controllers/chatController.js
//live chat controller

exports.chatBotResponse = (req, res) => {
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

    return res.status(200).json({ reply: response });
};
