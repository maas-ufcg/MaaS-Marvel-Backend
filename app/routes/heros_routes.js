var passport = require('passport');  
var express = require('express');  
var config = require('../../config/main');  
var jwt = require('jsonwebtoken');  
var Hero = require('../models/hero');

module.exports = function(app) {  
  var apiRoutes = express.Router();

  apiRoutes.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    Hero.find({}, {_id: 0, __v: 0}, function(err, heros) {
        if(err) {
            res.json(err);
        } else {
            res.json(heros);
        }
    }).skip(parseInt(req.query['offset'] || 0)).limit(parseInt(req.query['limit'] || 20));
  });

  // Set url for API group routes
  app.use('/api/heros', apiRoutes);
};