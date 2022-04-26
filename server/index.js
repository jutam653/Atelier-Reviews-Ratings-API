const express = require('express');
const psql = require('./database/postgres/model.js');

const PORT = 3001;

const app = express();

app.use(express.json());

app.get('/reviews', (req, res) => {
  const reviews = {};
  let page = req.query.page || 1;
  let count = Number(req.query.count) || 5;
  let order = req.query.sort || 'helpful';
  psql.getReviews(req.query.product_id, page, count, order)
    .then((results) => {
      reviews.product = req.query.product_id
      reviews.page = Number(page)
      reviews.count = count
      reviews.results = results.rows
    })
    .then(() => res.status(200).send(reviews))
    .catch((err) => res.status(404).send(err));
});

app.get('/reviews/meta', (req, res) => {
  psql.getMeta(req.query.product_id)
    .then((results) => res.status(200).send(results.rows[0]))
    .catch((err) => res.status(404).send(err));
});

app.post('/reviews', (req, res) => {
  let date = new Date().getTime();
  psql.addReview(req.body, date)
    .then((results) => res.status(201).send('CREATED'))
    .catch((err) => res.status(404).send(err));
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  psql.markHelpful(req.params.review_id)
    .then((results) => res.status(204).send('UPDATED'))
    .catch((err) => res.status(404).send(err));
});

app.put('/reviews/:review_id/report', (req, res) => {
  psql.reportReview(req.params.review_id)
    .then((results) => res.status(204).send('REPORTED'))
    .catch((err) => res.status(404).send(err));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});

module.exports = app;