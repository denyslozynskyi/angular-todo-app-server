const nodemailer = require('nodemailer');
const config = require('config');

const transporter = nodemailer.createTransport({
  host: config.get('mailerHost'),
  port: config.get('mailerPort'),
  secure: false,
  auth: {
    user: config.get('mailerUser'),
    pass: config.get('mailerPass'),
  },
}, {
  from: config.get('mailerUser'),
});

function mailer(message) {
  transporter.sendMail(message, (err) => {
    if (err) {
      return console.log(err);
    }
    return console.log('Email sent');
  });
}

module.exports = {
  mailer,
};
