const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
 host: 'smtp.example.com',
 port: 587,
 secure: false, 
 auth: {
   user: 'natnaelmessay71@gmail.com',
   pass: 'usfw wure nslg cfts' 
 }
});

module.exports = transporter;