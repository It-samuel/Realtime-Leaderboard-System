const client = require('prom-client');

const collectDefaultMetrics =
  client.collectDefaultMetrics;

collectDefaultMetrics();

module.exports = client;


const requestCounter =
  new client.Counter({

    name: 'http_requests_total',

    help: 'Total HTTP Requests'

  });

module.exports = {
  client,
  requestCounter
};


const requestDuration =
  new client.Histogram({

    name: 'http_request_duration_seconds',

    help: 'Request duration in seconds',

    buckets: [0.1, 0.5, 1, 2, 5]

  });


module.exports = {
  client,
  requestCounter,
  requestDuration
};