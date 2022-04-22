const db = require('./index.js');

const getReviews = (id) => {
  return db.query(`SELECT * FROM reviews WHERE product_id = ${id}`)
}

module.exports = {
  getReviews,
}