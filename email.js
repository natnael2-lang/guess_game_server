const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
 host: 'smtp.example.com',
 port: 587,
 secure: false, 
 auth: {
   user: 'natnaelmessay71@gmail.com',
   pass: 'qici bqim mrzc hppr' 
 }
});

module.exports = transporter;