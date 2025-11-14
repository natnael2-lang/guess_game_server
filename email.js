const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "natnaelmessay71@gmail.com", 
    pass: "usfw wure nslg cfts"
  }
});

module.exports = transporter;