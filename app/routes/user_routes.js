var passport = require('passport');  
var express = require('express');  
var config = require('../../config/main');  
var jwt = require('jsonwebtoken');

var User = require('../models/user');  

module.exports = function(app) {  
  var apiRoutes = express.Router();
  
  apiRoutes.post('/register', function(req, res) {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      favorites: req.body.favorites
    });

    newUser.save(function(err) {
      if (err) {
        if(err.code == 11000) {
          return res.status(409).json({ success: false, message: 'Email is already taken.'});
        } 

        return res.status(400).json({ success: false, message: err.message });
      }

      return res.status(201).json({ success: true, message: 'Successfully created new user.' });
    });
  });

  apiRoutes.post('/authenticate', function(req, res) {
    console.log('New authententication attempt with ' + req.body.email);
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(user, config.secret, {
              expiresIn: 60*60*24*7
            });
            
            res.status(200).json({ success: true, userInfo: generateUserInfo(user), token: 'JWT ' + token });
            console.log(user._id + ' successfully authenticated');
          } else {
            res.status(401).json({ success: false, message: 'Authentication failed. Bad credentials.' });
          }
        });
      }
    });
  });

// this is for authentication purpose only
  function generateUserInfo(user) {
    let userInfo = {};
    userInfo._id = user._id;
    userInfo.name = user.name;  
    userInfo.email = user.email;
    userInfo.favorites = user.favorites;
    return userInfo;
  }

  // Set url for API group routes
  app.use('/api/users', apiRoutes);
};
