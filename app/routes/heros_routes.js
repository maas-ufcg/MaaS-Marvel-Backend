var passport = require('passport');  
var express = require('express');  
var config = require('../../config/main');  
var jwt = require('jsonwebtoken');  
var Hero = require('../models/hero');

module.exports = function(app) {  
  var apiRoutes = express.Router();

  apiRoutes.get('/heros', passport.authenticate('jwt', { session: false }), function(req, res) {
    Hero.find({}, function(err, heros) {
        if(err) {
            res.json(err);
        } else {
            res.json(heros);
        }
    }).skip(parseInt(req.query['offset'])).limit(parseInt(req.query['limit']));
  });

  // Set url for API group routes
  app.use('/api', apiRoutes);
};