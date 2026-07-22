const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendOTPEmail = async (toEmail, toName, code) => {
  const sentFrom = new Sender('noreply@test-z0vklo6xrkvl7qrx.mlsender.net', 'Budget Tracker');
  const recipients = [new Recipient(toEmail, toName)];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
      <h2 style="color: #10b981; margin-bottom: 20px;">Password Recovery</h2>
      <p style="font-size: 15px; color: #e2e8f0;">Your Budget Tracker verification code is:</p>
      <p style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 4px; margin: 20px 0;">${code}</p>
      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject('Budget Tracker - Password Recovery OTP')
    .setHtml(html)
    .setText(`Your verification code is: ${code}. This code expires in 15 minutes.`);

  await mailerSend.email.send(emailParams);
};

module.exports = { sendOTPEmail };