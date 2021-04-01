const Emails = require("../models/Emails");
const nodemailer = require("nodemailer");

exports.getEmailById = (req, res, next, id) => {
  Emails.findById(id)
    .populate("user")
    .exec((err, emails) => {
      if (err) {
        return res.status(400).json({
          error: "Couldn't get email",
        });
      }
      req.emails = emails;
      next();
    });
};

exports.getAllEmails = (req, res) => {
  Emails.findOne({ user: req.profile._id })
    .populate("user")
    .exec((err, emails) => {
      if (err) {
        return res.status(400).json({
          error: "No emails found",
        });
      }
      return res.json(emails);
    });
};

exports.addEmails = (req, res) => {
  const emails = new Emails(req.body);
  emails.save((err, emails) => {
    if (err || !emails) {
      return res.status(400).json({
        error: "Not able to save emails",
        err,
      });
    }
    return res.json(emails);
  });
};

exports.updateEmails = (req, res) => {
  const emails = new Emails(req.emails);
  emails.doctorMail = req.body.doctorMail
    ? req.body.doctorMail
    : req.emails.doctorMail;

  emails.relativeOne = req.body.relativeOne
    ? req.body.relativeOne
    : req.emails.relativeOne;

  emails.relativeTwo = req.body.relativeTwo
    ? req.body.relativeTwo
    : req.emails.relativeTwo;

  emails.relativeThree = req.body.relativeThree
    ? req.body.relativeThree
    : req.emails.relativeThree;

  emails.relativeFour = req.body.relativeFour
    ? req.body.relativeFour
    : req.emails.relativeFour;

  emails.save((err, updatedEmails) => {
    if (err) {
      return res.status(400).json({ error: "Failed to update " });
    }
    res.json(updatedEmails);
  });
};

exports.sendEmail = (req, res) => {
  const {
    doctorMail,
    relativeOne,
    relativeTwo,
    relativeThree,
    link,
  } = req.body;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PSWD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: `${doctorMail}, ${relativeOne}, ${relativeTwo}, ${relativeThree}`,
    subject: "Video call joining link.",
    text: `Link for joining video is ${link} `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.json({ status: "fail" });
    } else {
      return res.json({
        status: "success",
      });
    }
  });
};
