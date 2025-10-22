// controllers/chatController.js
// Live Chat Controller (ES Module)

// Named export for ES Module import
export const chatBotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Please provide a message to proceed." });
    }

    // Convert message to lowercase for case-insensitive matching
    const lowerMessage = message.toLowerCase().trim();

    // Define responses based on AgroChain Ethiopia context
    let response = "I'm sorry, I didn't quite get that. Could you please provide more details?";

    // General greetings and farewells
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response = "Hello! Welcome to AgroChain Ethiopia. How can I assist you today with our agricultural solutions?";
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      response = "Goodbye! Thank you for visiting AgroChain Ethiopia. Feel free to return anytime!";
    }

    // Website navigation and features
    else if (lowerMessage.includes("login") || lowerMessage.includes("sign in")) {
      response = "To log in, please visit our login page at /login. If you don't have an account, you can sign up to join our platform!";
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("support")) {
      response = "You can reach our support team by visiting the contact page at /contact. We're here to help with any questions!";
    } else if (lowerMessage.includes("about")) {
      response = "Learn more about AgroChain Ethiopia on our About page at /about. We empower farmers with technology and transparency.";
    } else if (lowerMessage.includes("register") || lowerMessage.includes("sign up")) {
      response = "To register, visit our login page at /login and select 'Sign Up'. We'll guide you through the process with your Ethiopian National ID!";
    } else if (lowerMessage.includes("feedback")) {
      response = "We value your feedback! Please share your thoughts on the contact page at /contact or email us directly.";
    }

    // Services-related queries
    else if (lowerMessage.includes("traceability")) {
      response = "Our Enhanced Traceability service tracks products from farm to consumer with secure records. Learn more on our services page!";
    } else if (lowerMessage.includes("logistics") || lowerMessage.includes("transport")) {
      response = "We offer Logistics & Transport solutions, including optimized routes and cold chain management. Check our services for details!";
    } else if (lowerMessage.includes("marketplace")) {
      response = "Our Digital Marketplace connects farmers with buyers directly. Explore it on our services page to start selling!";
    } else if (lowerMessage.includes("kyc") || lowerMessage.includes("verification")) {
      response = "KYC Verification uses your Ethiopian National ID for secure marketplace access. Visit our services section for more info.";
    } else if (lowerMessage.includes("quality") || lowerMessage.includes("product")) {
      response = "We ensure high agricultural product quality through traceability and farmer support. Ask about specific products for details!";
    }

    // Features and tools
    else if (lowerMessage.includes("mobile app")) {
      response = "Our Mobile App is coming soon! Stay tuned for on-the-go access to our platform features.";
    } else if (lowerMessage.includes("data management")) {
      response = "We provide secure cloud storage for agricultural data. Learn more about our additional features!";
    } else if (lowerMessage.includes("security")) {
      response = "Your data is protected with enterprise-grade security. Explore our security features on the website!";
    }

    // Farming and agriculture support
    else if (lowerMessage.includes("how to farming") || lowerMessage.includes("crops")) {
      response = "We support farmers with tools for better crop management and market access. Need tips? Ask about specific crops!";
    } else if (lowerMessage.includes("tips") || lowerMessage.includes("advice")) {
      response = "For farming tips, we recommend sustainable practices like crop rotation. Contact our experts at /contact for personalized advice!";
    } else if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      response = "For pricing details, please visit https://x.ai/grok or contact our sales team at /contact.";
    } else if (lowerMessage.includes("payment")) {
      response = "Our Digital Marketplace offers secure payment processing. Learn more on the services page or contact support for assistance.";
    }

    // Partnership and collaboration
    else if (lowerMessage.includes("partner") || lowerMessage.includes("collaboration")) {
      response = "Interested in partnering with AgroChain Ethiopia? Please reach out via our contact page at /contact with your proposal!";
    } else if (lowerMessage.includes("join") || lowerMessage.includes("team")) {
      response = "To join our team, check for career opportunities on our contact page at /contact. We’re always looking for innovators!";
    }

    // Technical support and issues
    else if (lowerMessage.includes("error") || lowerMessage.includes("problem")) {
      response = "Sorry to hear about the issue! Please describe the problem, or contact support at /contact for immediate assistance.";
    } else if (lowerMessage.includes("account") || lowerMessage.includes("profile")) {
      response = "For account or profile issues, log in at /login and visit your dashboard, or contact support if you need help.";
    } else if (lowerMessage.includes("update") || lowerMessage.includes("change")) {
      response = "To update your information, log in and access your profile. Need help? Contact us at /contact!";
    }

    // Help and general assistance
    else if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
      response = "I'm here to help! Ask about services (traceability, logistics), features (mobile app, security), or navigation (login, contact). What’s on your mind?";
    } else if (lowerMessage.includes("farmer") || lowerMessage.includes("agriculture")) {
      response = "We empower Ethiopian farmers with technology for fair pricing and market access. Check our mission on the About page!";
    }

    // Fallback with suggestion
    if (response === "I'm sorry, I didn't quite get that. Could you please provide more details?") {
      response += " You can ask about traceability, logistics, farming tips, or use 'help' for more options.";
    }

    // Respond with the bot message
    return res.status(200).json({ reply: response });

  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    return res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
  }
};