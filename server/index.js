const express = require('express');
const psql = require('./database/postgres/model.js');

const PORT = 3001;

const app = express();

app.use(express.json());

app.get('/reviews', (req, res) => {
  const product = {};
  let page = req.query.page || 1;
  let count = Number(req.query.count) || 5;
  let order = req.query.sort || 'helpful';
  psql.getReviews(req.query.product_id, page, count, order)
    .then((results) => {
      console.log(results.rows)
      product.product = req.query.product_id
      product.page = Number(page)
      product.count = count
      product.results = results.rows
    })
    .then(() => res.status(200).send(product))
    .catch((err) => res.status(404).send(err));
})

app.get('/reviews/meta', (req, res) => {
  psql.getMeta(req.query.product_id)
    .then((results) => res.status(200).send(results.rows[0]))
    .catch((err) => res.status(404).send(err));
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});

