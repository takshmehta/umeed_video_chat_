const express = require("express");
const Router = express.Router();

const {
  signup,
  signin,
  signout,
  isSignedIn,
  isAuthenticated,
  getUserById,
} = require("../controller/controller_auth");

Router.param("userId", getUserById);

Router.post("/signup", signup);
Router.post("/signin", signin);
Router.get("/signout", signout);

Router.get("/testroute/:userId", isSignedIn, isAuthenticated, (req, res) => {
  res.json({ success: "wokred" });
});
module.exports = Router;
