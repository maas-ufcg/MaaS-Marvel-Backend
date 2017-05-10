var User = require('../models/user');  
var ChatRecord = require('../models/chat_record');
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

    socket.on('subscribe', function(heroId) {
      socket.join(heroId);
      socket.room = heroId;

      let notification = new ChatRecord({
        heroId: heroId, 
        type: 'notification', 
        from: user._id, 
        message: 'joined the chat room'
      });

      socket.to(heroId).emit('new message', notification);
      notification.save();
    });

    socket.on('get user info', function(userId, fn) {
      User.findOne({_id: userId}, function(err, user){
        if(user) {
          fn({_id: userId, name: user.name});
        }
      });
    })

    socket.on('retrieve messages', function(heroId, fn) {
      ChatRecord.find({heroId: heroId}, function(err, records){
        fn(records);
      });
    });

    socket.on('new message', function(msg, fn){
      let message = new ChatRecord(msg);
      socket.to(message.heroId).emit('new message', message);
      message.save();
      fn(message);
    });

    socket.on('disconnect', function() {
      let notification = new ChatRecord({
        heroId: socket.room, 
        type: 'notification', 
        from: user._id, 
        message: 'left the chat room'
      });

      socket.to(socket.room).emit('new message', notification);
      notification.save();
    });
    
  });
};

