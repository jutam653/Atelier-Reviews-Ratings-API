const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPW,
  port: process.env.DBPORT,
});

client.connect();

module.exports = client;

