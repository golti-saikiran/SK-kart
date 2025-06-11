const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSCODE,
    },
});

async function sendmail({ sendTo, Subject, Text, Html }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_ID,
            to: sendTo,
            subject: Subject,
            text: Text,
            html: Html,
        });

        console.log("Email sent successfully:", info.response);
        return { success: true, message: "Email sent successfully", info };
    } catch (error) {
        console.error("Failed to send email:", error);

        // Handling specific error cases
        if (error.response && error.response.includes("550")) {
            return { success: false, message: "Invalid email address or recipient does not exist." };
        }

        return { success: false, message: "Failed to send email. Please try again later.", error };
    }
}

module.exports = sendmail;
