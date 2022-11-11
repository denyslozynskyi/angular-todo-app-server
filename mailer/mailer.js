/* eslint-disable consistent-return */
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
  from: 'Dashboards app',
});

function mailer(message) {
  transporter.sendMail(message, (err) => {
    if (err) {
      return console.log(err);
    }
  });
}

module.exports = {
  mailer,
};
