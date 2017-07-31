const request = require('request-promise-native');
const parseArgs = require('minimist');
const uuid = require('uuid/v4');
const IDChecker = require('./id.js');

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dstHosts = args['_'];

  const myId = uuid();
  const idChecker = new IDChecker();

  console.log(`Monitoring hosts ${dstHosts} as ID ${myId}`);

  (function test() {
    const promises = [];
    dstHosts.forEach((host) => {
      promises.push(associateWith(host, myId));
      promises.push(saveId(idChecker, host));
    });

    Promise.all(promises).then(() => {
      idChecker.check();
    }).catch(function () {
      console.warn("A connection failed");
    });

    setTimeout(test, 15*1000);
  })();
}

function associateWith(host, myId) {
  const handler = (err, resp, body) => {
    if (err) {
      console.error(`/associate request to ${host} failed:`, err);
      return;
    }
  }

  const postArgs = {
    uri: `http://${host}/associate`,
    json: {
      id: myId,
    },
  }
  return request.post(postArgs, handler);
}

function saveId(idChecker, host) {
  const handler = (err, resp, body) => {
    if (err) {
      console.error(`/id request to ${host} failed:`, err);
      return;
    }

    idChecker.associate(host, body);
  }

  return request(`http://${host}/id`, handler);
}

main();
