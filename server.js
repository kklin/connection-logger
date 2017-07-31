const express = require('express');
const bodyParser = require('body-parser');
const parseArgs = require('minimist');
const uuid = require('uuid/v4');
const IDChecker = require('./id.js');

let port = 80;

const args = parseArgs(process.argv.slice(2));
const portArg = args['port'];

if (portArg !== undefined) {
  const parsedPort = Number(portArg);
  if (isNaN(parsedPort)) {
    console.warn(`Failed to parse port ${portArg}. Using the default (${port}).`)
  } else {
    port = parsedPort;
  }
}

const myId = uuid();
const idChecker = new IDChecker();

const app = express();
app.use(bodyParser.json());

app.post('/associate', (request, response) => {
  const id = request.body.id;
  if (id === undefined) {
    response.status(400).send('The id field is required');
    return;
  }

  idChecker.associate(request.ip, id);
  response.send('OK');

  idChecker.check();
});

app.get('/id', (request, response) => {
  response.send(myId);
});

app.listen(port, (err) => {
  if (err) {
    console.warn('Listen failed:', err);
  }

  console.log(`Listening on port ${port} as ID ${myId}`);
});
