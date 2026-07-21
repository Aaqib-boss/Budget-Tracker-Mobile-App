const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendOTPEmail = async (toEmail, toName, code) => {
  const sentFrom = new Sender('noreply@test-z0vklo6xrkvl7qrx.mlsender.net', 'Budget Tracker');
  const recipients = [new Recipient(toEmail, toName)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject('Your Password Reset Code')
    .setHtml(`<p>Hello ${toName},</p><p>Your verification code is: <strong>${code}</strong></p><p>This code expires in 15 minutes.</p>`)
    .setText(`Your verification code is: ${code}`);

  await mailerSend.email.send(emailParams);
};

module.exports = { sendOTPEmail };