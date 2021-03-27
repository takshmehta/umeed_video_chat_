const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

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
};

exports.signin = (req, res) => {
  const password = req.body.password;
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Email doesnot exist" });
    }

    if (!user.authenticate(password)) {
      return res.json({ error: "Password error" });
    }

    const token = jwt.sign({ id: user._id }, "mysecret");

    res.cookie("token", token, { expire: new Date() + 5555 });
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
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
