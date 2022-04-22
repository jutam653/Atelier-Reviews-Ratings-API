const express = require('express');
const psql = require('./database/postgres/model.js');

const PORT = 3001;

const app = express();

app.use(express.json());

app.get('/reviews', (req, res) => {
  psql.getReviews(66000)
    .then((results) => res.status(200).send(results.rows));
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});

