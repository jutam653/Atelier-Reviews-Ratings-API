const db = require('./index.js');

const getReviews = (id, page, count, order) => {
  let sort;
  let offset = (page - 1) * count

  if (order === 'helpful') {
    sort = 'ORDER BY r.helpfulness DESC';
  } else if (order === 'newest') {
    sort = 'ORDER BY r.date DESC';
  } else {
    sort = 'ORDER BY r.helpfulness DESC, r.date DESC';
  }

  const query = `
    SELECT r.review_id, r.rating, r.summary, r.recommend, r.response, r.body, to_timestamp(r.date / 1000) AS date, r.reviewer_name, r.helpfulness,
    COALESCE(json_agg(
      json_build_object('id', p.photo_id, 'url', p.url)
    ) FILTER (WHERE p.photo_id IS NOT NULL), '[]') photos
    FROM photos p
    RIGHT OUTER JOIN reviews r
    ON r.review_id = p.review_id
    WHERE r.product_id = ${id}
    GROUP BY r.review_id
    ${sort}
    LIMIT ${count} OFFSET ${offset}
  `;

  return db.query(query)
}

module.exports = {
  getReviews,
}