"use strict";
var db = require('../data/db.js');
var nodemailer = require('nodemailer');

var GMAIL_ACCT = process.env.EVAL_N_GMAIL_ACCT;
var GMAIL_PW = process.env.EVAL_N_GMAIL_PW;
var URL = process.env.EVAL_N_WEB_URL;

var notifications_enabled = process.env.EVAL_N_NOTIFY_ENABLE;


var transporter = nodemailer.createTransport('smtps://' + GMAIL_ACCT + ':' + GMAIL_PW + '@smtp.gmail.com');


module.exports.getNotificationStatus = function () {
  return notifications_enabled;
};

module.exports.init = function () {
  if (!GMAIL_ACCT || !GMAIL_PW) {
    console.error('Notifier config not set. Disabling notifications. Check Gmail account, password, and web app URL are set correctly.');
    notifications_enabled = false;
  }
  if (!notifications_enabled) {
    console.log('Email notifications are disabled');
    return;
  }

  if (!checkEmailNotifications()) {
    console.error('Sending test email failed. Notifications are not functioning correctly and will be disabled.');
    notifications_enabled = false;
    return;
  }
  console.log('Email notifier initialized');

};

module.exports.sendEmailNotification = function (userId, evaluation) {
  getUserEmail();


  function getUserEmail() {
    db.table('accounts')
      .filter({
        "id": userId
      })
      .limit(1)
      .then(function (result) {
        if (result.length == 0) {
          console.error('email not found for user ' + id);
        }
        sendMessage(result[0].email);
      })
      .error(function (err) {
        console.error('error getting email for user ' + id);
        console.error(err);
      })
  }

  function sendMessage(toAddress) {
    console.log('Sending email notification to ' + toAddress + ' for evaluation ' + evaluation.name);
    var mailOptions = {
      from: 'Eval n System, ' + GMAIL_ACCT,
      to: toAddress,
      subject: 'Evaluation Results Available',
      text: 'Results for your evaluation "' + evaluation.name + '" are now available. View them at ' + URL,
      html: '<p>Results for your evaluation <b>' + evaluation.name + '</b> are now available. View them <a href="' + URL + '">here.</a></p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Sending email to ' + toAddress + ' failed');
        return console.log(error);
      }
      console.log('Email notification sent to: ' + toAddress + '\n' + info.response);
    });
  }

};

var checkEmailNotifications = function () {
  console.log('Checking email notification service...');

  var mailOptions = {
    from: 'Eval n System, ' + GMAIL_ACCT,
    to: GMAIL_ACCT,
    subject: 'Eval n Email Test',
    text: 'If you have received this message, Eval n server email notifications are functional',
    html: '<p>If you have received this message, Eval n server email notifications are functional</p>'
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.error('Sending test email failed.');
      return false;
    }
  });

  return true;
};
