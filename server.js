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
app.use('/', express.static(__dirname + '/www'));

// Connect to database
mongoose.connect(config.database);

// Load data from Marvel if absent
// require('./scripts/data_loader')();

require('./app/routes/user_routes')(app);
var server = require('http').createServer(app);

// Start the server
server.listen(port);

console.log('Your server is running on port ' + port + '.');

require('./app/chat/chat_socket')(server);
