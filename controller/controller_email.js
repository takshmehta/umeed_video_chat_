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
    html: `
    <!doctype html>
    <html lang="en-US">
    
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Video call invitation link from Umeed</title>
        <meta name="description" content="Video call invitation link">
        
    </head>
    
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <h1>
                              <a href="https://umeedvideochat.herokuapp.com/" title="logo" target="_blank" style="text-decoration: none; color: #00b389">
                                UMEED
                              </a>
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Video call invitation link from Umeed</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                You are getting this email because someone using our website registered your email as either a doctor or a relative. You can join this video call using the button given below.
                                            </p>
                                            <a href=${link}
                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Join call</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://umeedvideochat.herokuapp.com/</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    
    </html>`,
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
