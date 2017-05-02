var User = require('../models/user');  
var config = require('../../config/main');
var jwt = require('jsonwebtoken');
var jwtAuth = require('socketio-jwt-auth');
var passport = require('../../config/passport');

module.exports = function(server) {  
  var io = require("socket.io")(server);

  io.use(jwtAuth.authenticate({
    secret: config.secret,    // required, used to verify the token's signature
  }, function(payload, done) {
  
    User.findById(payload._doc._id, function(err, user){
      if(err) {
        return done(err);
      }
      
      if (!user) {
        return done(null, false);
      }

      console.log('user ' + payload._doc._id + ' was authorized');
      return done(null, user);
    });
  }));
  
  io.on('connection', function(socket) {
    let user = socket.request.user;

    console.log('user ' + user._id + ' connected to the chat');
  });
};

