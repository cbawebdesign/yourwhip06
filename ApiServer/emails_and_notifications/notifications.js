const CONFIG = require('../constants');

const sendNotification = function (data) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${CONFIG.ONESIGNAL_REST_KEY}`,
  };

  const options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers,
  };

  const https = require('https');
  const req = https.request(options, function (res) {
    res.on('data', function (data) {
      console.log('Response:');
      // console.log(JSON.parse(data));
    });
  });

  req.on('error', function (e) {
    console.log('ERROR:');
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

module.exports = sendNotification;
