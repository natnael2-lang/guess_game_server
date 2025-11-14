const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'natnaelmessay71@gmail.com',
    pass: 'qici bqim mrzc hppr', 
  },
});
module.exports = transporter;