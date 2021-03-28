const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const nodemailer=require('nodemailer');
const bcrypt=require('bcryptjs');

var transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
      user:'umeed123890@gmail.com',
      pass:'qweqwe@123'
  }
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


exports.forgotpswd=async(req,res)=>{
  const email=req.body.email;
  const user=await User.findOne({email:req.body.email});
  if(user){
    console.log(user._id);
      const resetToken = jwt.sign({_id:user._id}, 'asdfghjklqwertyuiop', {expiresIn:'5m'});
      console.log(resetToken);
      var mailOptions={
          from:'umeed123890@gmail.com',
          to:email,
          subject:'Reset passsword',
          html:`
          <p>You requested for reset password</p>
          <h2> Please click on this <a href="http://localhost:3001/reset-password/${req.body.email}/${resetToken}">http://new-database/_/auth/reset_pwd/${req.body.email}?token=${resetToken}</a> link for reset password- </h2><br/>`,    };
  
          transporter.sendMail(mailOptions,function(error,info){
              if(error){
                  console.log(error);
              }
              else{
                 
                  res.status(200).json({
                      message:`Reset email sent to ${email} successfully! Please check your mail for further instructions`
                  })
              };

                 
              })
          

          }



          else{
              res.status(401).json({
                  message:`Profile of ${email} not found!`
              })
          }
  

  


      

  }


  exports.resetPassword=async (req,res)=>{
      const resetToken=req.params.resettoken;
      const user=await User.findOne({email:req.params.email});
console.log(req.params.email);
console.log(req.body.newpswd);
console.log(req.body.cnfrmnewpswd);
console.log(resetToken);
      if(resetToken){
          jwt.verify(resetToken,'asdfghjklqwertyuiop', (err,user)=>{
              if(err){
                  if(err.name=="TokenExpiredError"){
                      res.status(420).json({
                          message:"Token timed out!",
                          
                      })
                  }
                  else{
                      res.status(421).json({
                          message:"Incorrect Token"
                      })
                  }
              }
              else{
                  if(req.body.newpswd===req.body.cnfrmnewpswd){
                  bcrypt.hash(req.body.newpswd,8)
                  .then((hashedPassword)=>{
                      return User.findOneAndUpdate({_id:user._id},{password:hashedPassword},{new:true})
                  })
                  .then((user)=>{
                      if(user){
                          res.status(200).json({
                              message:`Password of ${user.email} changed successfully!`
                          })
                      }
                      else{
                          res.status(401).json({
                              message:`Profile of 1'${user._id} not found!`
                          })
                      }
                  })
                  .catch((err)=>{
                      res.status(400).json({
                          message:`Error updating  password!`
                      })
                  })  
              }
          else{
              res.status(402).json({
                  message:"password not matching"
              })
          }
      }

          })
      }
      else{
      
          res.status(405).json({
              message:'Authentication token not found!'
          })
      }
  }

  
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
