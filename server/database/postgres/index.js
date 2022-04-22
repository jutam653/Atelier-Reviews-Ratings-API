const { Client } = require('pg');
const client = new Client({
  user: 'julian',
  host: 'localhost',
  database: 'reviews',
  port: 5432,
});
client.connect();

module.exports = client;

