// Include our packages in our main server file
const express = require('express');
app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('./config/main');
const cors = require('cors');
const events = require('events');
const port = process.env.PORT || 3000;

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Log requests to console
app.use(morgan('dev'));

// Connect to database
mongoose.connect(config.database);

// Load data from Marvel if absent
require('./scripts/data_loader')();

app.use(passport.initialize());
require('./config/passport')(passport);

require('./app/routes/user_routes')(app);
require('./app/routes/hero_routes')(app);
var server = require('http').createServer(app);

// Start the server
server.listen(port);

console.log('server is running on port ' + port + '.');

require('./app/chat/chat_socket')(server);
