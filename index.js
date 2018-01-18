const express = require('express');
const flexjson = require('jsonflex')();
const compression = require('compression');
const path = require('path');

// Create express server
const app = express();

// Express middleware
app.use(compression());
app.use(flexjson);
app.use(express.static('www'));

app.listen(3000, () =>
  console.log('Webserver listening on port 3000')
);
