const express = require("express");
const Router = express.Router();

const {
  addEmails,
  updateEmails,
  getEmailById,
  getAllEmails,
  sendEmail
} = require("../controller/controller_email");

const {
  getUserById,
  isAuthenticated,
  isSignedIn,
} = require("../controller/controller_auth");

Router.param("userId", getUserById);
Router.param("emailId", getEmailById);

Router.post("/email/:userId", isSignedIn, isAuthenticated, addEmails);

Router.put(
  "/email/:userId/:emailId",
  isSignedIn,
  isAuthenticated,
  updateEmails
);

Router.post("/access",sendEmail);

Router.get("/emails/:userId", getUserById, getAllEmails);

module.exports = Router;
