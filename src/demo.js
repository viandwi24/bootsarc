const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// route
app.get('/', function(req, res) {
  // redirect to /pages/index.html
  res.redirect('/pages/index.html');
});
app.use('/pages', express.static('pages'))
app.use('/dist', express.static('dist'))
app.use('/assets', express.static('assets'))

// listen
app.listen(port);
console.log('Server started at http://localhost:' + port);
module.exports = app;
