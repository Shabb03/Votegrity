const nodemailer = require('nodemailer');
require('dotenv').config();

//Send an email using the nodemailer framework with the provided subject, recipient and body of email
async function sendEmail(subject, recipient, body) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: recipient,
            subject: subject,
            text: body,
        };
        await transporter.sendMail(mailOptions);
    } 
    catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;