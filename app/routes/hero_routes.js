var passport = require('passport');  
var express = require('express');  
var config = require('../../config/main');  
var jwt = require('jsonwebtoken');  
var Hero = require('../models/hero');
var User = require('../models/user');

module.exports = function(app) {  
  var apiRoutes = express.Router();

  apiRoutes.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    Hero.find({}, {_id: 0, __v: 0}, function(err, heroes) {
        if(err) {
            res.json(err);
        } else {
            res.json(heroes);
        }
    }).skip(parseInt(req.query['offset'] || 0)).limit(parseInt(req.query['limit'] || 20));
  });

  apiRoutes.post('/favorite/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    User.findOne({email: req.user.email}, function(err, doc) { 
      if (err) throw err;

      var id = req.params.id; 
      if( doc.favorites.filter(x => x == id).length == 0 ) {
        doc.favorites.push(id);
      }

      doc.save();
      return res.status(200).json({ success: true, message: 'Successfully marked hero as favorite'});
    });
  });

  apiRoutes.delete('/favorite/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    User.findOne({email: req.user.email}, function(err, doc) { 
      if (err) throw err;
      
      var index = doc.favorites.indexOf(req.params.id);

      if(index >= 0) {
        doc.favorites.splice(index, 1);
      }
      
      doc.save();
      return res.status(200).json({ success: true, message: 'Successfully unmarked hero as favorite'});
    });
  });

  // Set url for API group routes
  app.use('/api/heroes', apiRoutes);
};
