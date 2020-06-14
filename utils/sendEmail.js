const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  secureConnection: "false",
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false
  }
});

const sendConfirmationMail = studentID => {
  const token = jwt.sign({ studentID }, process.env.SECRET_KEY, {
    expiresIn: "5d"
  }); // Generate Token
  const url = `http://localhost:5000/auth/token/${token}`;

  console.log(url);

  const mailOptions = {
    from: '"Programming Club" <sengrp13@gmail.com>',
    to: `${String(studentID)}@daiict.ac.in`,
    subject: "Student Account Confirmation",
    html:
      `Hello, <strong>${studentID}</strong> <br><br>` +
      `<p>Please click <a href="${url}">here</a> to verify your student acccount.</p><br>` +
      "Regards,<br>" +
      "Programming Club."
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

const sendPasswordResetMail = studentID => {
  const token = jwt.sign({ studentID }, process.env.SECRET_KEY, {
    expiresIn: "5d"
  }); // Generate Token
  const url = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
    from: '"Programming Club" <sengrp13@gmail.com>',
    to: `${String(studentID)}@daiict.ac.in`,
    subject: "Reset Password",
    html:
      `Hello, <strong>${studentID}</strong> <br><br>` +
      `<p>Please click <a href="${url}">here</a> to change the password.</p><br>` +
      "Regards,<br>" +
      "Programming Club."
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Message sent: %s", info.messageId);
  });
};

module.exports = {
  sendConfirmationMail,
  sendPasswordResetMail
};
