const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "natnaelmessay71@gmail.com", 
    pass: "natnael9646"
  }
});

module.exports = transporter;