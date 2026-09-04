import nodemailer from "nodemailer";

// 📧 የኢሜይል ማስተላለፊያ ማዋቀር (SMTP Transporter)
const transporter = nodemailer.createTransport({
  service: "gmail", // ወይም የሆቴሉን/ድርጅቱን SMTP ሰርቨር መጠቀም ትችላለህ
  auth: {
    user: process.env.EMAIL_USER, // ያንተ ኢሜይል (ለምሳሌ፡ bantalem@gmail.com)
    pass: process.env.EMAIL_PASS, // የጂሜይል አፕሊኬሽን ፓስወርድ (App Password)
  },
});

// 1. 🛒 ምርት ሲገዛ ለሻጩ የሚላክ ማሳወቂያ
export const sendNewOrderEmail = async (sellerEmail, sellerName, productTitle, quantity, amount) => {
  try {
    const mailOptions = {
      from: `"Ethio Marketplace" <${process.env.EMAIL_USER}>`,
      to: sellerEmail,
      subject: "🎉 አዲስ ትዕዛዝ ደርሶዎታል! (New Order Received)",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px;">
          <h2 style="color: #4CAF50;">እንኳን ደስ አለዎት ${sellerName}!</h2>
          <p>ካንተ መደብር ላይ አዲስ ምርት ተገዝቷል። ዝርዝሩ ከታች ቀርቧል፦</p>
          <hr/>
          <p><b>የምርት ስም:</b> ${productTitle}</p>
          <p><b>ብዛት:</b> ${quantity}</p>
          <p><b>አጠቃላይ ዋጋ:</b> ${amount} ETB</p>
          <hr/>
          <p>እባክዎን ምርቱን በጊዜ አዘጋጅተው ለደንበኛው ይላኩ (Ship ያድርጉ)።</p>
          <br/>
          <p style="font-size: 12px; color: #777;">ይህ በራስ-ሰር የመነጨ መልዕክት ነው።</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Error (Seller):", error.message);
  }
};

// 🚚 2. ምርቱ ሲላክ ለገዢው የሚላክ ማሳወቂያ
export const sendShippedEmail = async (buyerEmail, buyerName, productTitle, orderId) => {
  try {
    const mailOptions = {
      from: `"Ethio Marketplace" <${process.env.EMAIL_USER}>`,
      to: buyerEmail,
      subject: "🚚 ምርትዎ በባለቤቱ ተልኳል! (Your Order Has Shipped)",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px;">
          <h2 style="color: #2196F3;">ሰላም ${buyerName}, መልካም ዜና!</h2>
          <p>የገዙት ምርት አሁን በሻጩ ተሽጦ በመንገድ ላይ ይገኛል።</p>
          <hr/>
          <p><b>የምርት ስም:</b> ${productTitle}</p>
          <p><b>የትዕዛዝ መለያ ቁጥር (Order ID):</b> ${orderId}</p>
          <hr/>
          <p>ምርቱ እጅዎ ላይ ሲደርስ መተግበሪያው ላይ በመግባት <b>"Confirm Delivery"</b> የሚለውን መጫን እንዳይረሱ።</p>
          <br/>
          <p style="font-size: 12px; color: #777;">ስላገለገልንዎት እናመሰግናለን!</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Error (Buyer):", error.message);
  }
};