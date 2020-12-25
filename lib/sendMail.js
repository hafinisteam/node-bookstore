const nodemailer = require("nodemailer");
const config = require("../config.json");

async function sendMail({ to, subject, html, from = config.emailFrom }) {
  const transporter = nodemailer.createTransport(config.smtConfig);
  await transporter.sendMail({ from, to, subject, html });
}

module.exports = sendMail;
