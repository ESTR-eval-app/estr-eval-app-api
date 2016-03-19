"use strict";

var nodemailer = require('nodemailer');

var GMAIL_ACCT = process.env.EVAL_N_GMAIL_ACCT;
var GMAIL_PW = process.env.EVAL_N_GMAIL_PW;
var URL = process.env.EVAL_N_WEB_URL;

var notifications_enabled = process.env.EVAL_N_NOTIFY_ENABLE;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://eval.n.system%40gmail.com:3OnRbdOW2hKa@smtp.gmail.com');


module.exports.getNotificationStatus = function () {
  return notifications_enabled;
};

module.exports.init = function () {
  if (!GMAIL_ACCT || !GMAIL_PW) {
    console.error('Gmail account credentials not set. Notifications will be disabled.');
    notifications_enabled = false;
  }
  if (!notifications_enabled) {
    console.log('Email notifications are disabled');
  }
};

module.exports.sendEmailNotification = function (toAddress, evaluation) {

  var mailOptions = {
    from: 'Eval n System, ' + GMAIL_ACCT,
    to: toAddress,
    subject: 'Evaluation Results Available',
    text: 'Results for your evaluation "' + evaluation.name + '" are now available. View them at ' + URL, // plaintext body
    html: '<p>Results for your evaluation <b>' + evaluation.name + '</b> are now available. View them <a href="' + URL + '">here.</a></p>' // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });

};

var checkEmailNotifications = function () {
  console.log('Checking email notification service...');
  var mailOptions = {
    from: 'Eval n System, ' + GMAIL_ACCT,
    to: GMAIL_ACCT,
    subject: 'Eval n Email Test',
    text: 'If you have received this message, Eval n server email notifications are functional', // plaintext body
    html: '<p>If you have received this message, Eval n server email notifications are functional</p>' // html body
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.error('Sending test email failed.');
      return console.log(error);
    }
    console.log('Test message sent successfully.');
  });

};
sendEmailNotification('stevenlyall@gmail.com', {name: 'test'});