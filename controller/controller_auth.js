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
    user: "umeed123890@gmail.com",
    pass: "qweqwe@123",
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
  User.findOne({ email: req.body.email }, (err, userindb) => {
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
        const token = jwt.sign({ id: user._id }, "mysecret");

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

    const token = jwt.sign({ id: user._id }, "mysecret");

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
    const resetToken = jwt.sign({ _id: user._id }, "asdfghjklqwertyuiop", {
      expiresIn: "300000",
    });
    var mailOptions = {
      from: "umeed123890@gmail.com",
      to: email,
      subject: "Reset passsword",
      html: `
          <p>You requested for reset password</p>
         
            <h2> Please click on this <a href="http://localhost:3001/reset-password/${req.body.email}/${resetToken}">http://new-database/_/auth/reset_pwd/${req.body.email}?token=${resetToken}</a> link for reset password- </h2>;
          
         
          <br/>`,
    };
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
    jwt.verify(resetToken, "asdfghjklqwertyuiop", (err, user) => {
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
            .createHmac("sha256", newSalt)
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
  secret: "mysecret",
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
