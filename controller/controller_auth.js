const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4 } = require("uuid");
const { validationResult } = require("express-validator");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PSWD,
  },
});

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Couldn't get user",
      });
    }
    req.profile = user;
    next();
  });
};

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const { email } = req.body;
  User.findOne({ email: email }, (err, userindb) => {
    if (err) {
      console.log(err);
    }
    if (userindb) {
      return res.status(401).json({
        error: "A user with this email already exists.",
      });
    } else {
      const user = new User(req.body);

      user.save((err, user) => {
        if (err) {
          return res.json({ error: "User not saved", err });
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        res.cookie("token", token, { expire: new Date() + 5555 });
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      });
    }
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const password = req.body.password;
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Email doesnot exist" });
    }

    if (!user.authenticate(password)) {
      return res.json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res.cookie("token", token, { expire: new Date() + 5555 });
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};

exports.forgotpswd = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const email = req.body.email;
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.RESET_PSWD_JWT_KEY,
      {
        expiresIn: "300000",
      }
    );
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset passsword",
      html: `
          
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email</title>
    <meta name="description" content="Reset Password Email">
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
                        <a href="https://umeedvideochat.herokuapp.com/" title="logo" target="_blank"style="text-decoration: none;">
                        <h1 style=" color: #00b389;
                        font-weight: bold; ">
                    UMEED      
                                            </h1>
                        </a>
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
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.The link is valid for only 5 minutes.
                                        </p>
                                        <a href="https://umeedvideochat.herokuapp.com/reset-password/${req.body.email}/${resetToken}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
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
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong style="text-decoration:none;" >https://umeedvideochat.herokuapp.com/</strong></p>
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
    // <h2> Please click on this <a href="https://umeedvideochat.herokuapp.com/reset-password/${req.body.email}/${resetToken}">http://new-database/_/auth/reset_pwd/${req.body.email}?token=${resetToken}</a> link for reset password- </h2>;

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          message: `Reset email sent to ${email} successfully! Please check your mail for further instructions`,
        });
      }
    });
  } else {
    return res.status(401).json({
      error: `Profile of ${email} not found!`,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const resetToken = req.params.resettoken;
  var user1 = User.findOne({ email: req.params.email });
  if (resetToken) {
    jwt.verify(resetToken, process.env.RESET_PSWD_JWT_KEY, (err, user) => {
      if (err) {
        if (err.name == "TokenExpiredError") {
          console.log(err);
          return res.status(420).json({
            error: "Token timed out!",
          });
        } else {
          return res.status(421).json({
            error: "Incorrect Token",
          });
        }
      } else {
        if (req.body.newpswd === req.body.cnfrmnewpswd) {
          const newSalt = v4();
          const encry_password = crypto
            .createHmac(process.env.KEY, newSalt)
            .update(req.body.newpswd)
            .digest("hex");
          User.findOneAndUpdate(
            { _id: user._id },
            { encry_password: encry_password, salt: newSalt },
            { new: true }
          )
            .then((user) => {
              if (user) {
                return res.status(200).json({
                  message: `Password of ${user.email} changed successfully!`,
                });
              } else {
                return res.status(401).json({
                  error: `Profile of 1'${user._id} not found!`,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).json({
                error: `Error updating  password!`,
              });
            });
        } else {
          return res.status(402).json({
            error: "Both the passwords do not match.",
          });
        }
      }
    });
  } else {
    return res.status(405).json({
      error: "Authentication token not found!",
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "USer signed out" });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.auth.id == req.profile._id;
  if (!checker) {
    return res.status(400).json({
      error: "Access Denied",
    });
  }
  next();
};
