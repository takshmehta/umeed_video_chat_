const express = require("express");
const Router = express.Router();
const { check } = require("express-validator");
const {
  signup,
  signin,
  signout,
  forgotpswd,
  resetPassword,
  isSignedIn,
  isAuthenticated,
  getUserById,
} = require("../controller/controller_auth");

Router.param("userId", getUserById);

Router.post(
  "/signup",
  [
    check("name", "Name should be more than 3 letters").isLength({ min: 3 }),
    check("email", "Please enter a valid email.").isEmail(),
    check("password", "Password should contain atleast 5 letters.").isLength({
      min: 5,
    }),
  ],
  signup
);
Router.post(
  "/signin",
  [
    check("email", "Please enter a valid email.").isEmail(),
    check("password", "Password should contain atleast 5 letters.").isLength({
      min: 5,
    }),
  ],
  signin
);
Router.get("/signout", signout);
Router.post(
  "/forgotpswd",
  [check("email", "Please enter a valid email.").isEmail()],
  forgotpswd
);
Router.put(
  "/resetpswd/:email/:resettoken",
  [
    check("newpswd", "Password should contain atleast 5 letters.").isLength({
      min: 5,
    }),
  ],
  resetPassword
);

Router.get("/testroute/:userId", isSignedIn, isAuthenticated, (req, res) => {
  res.json({ success: "wokred" });
});
module.exports = Router;
