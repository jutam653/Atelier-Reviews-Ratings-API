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
    SELECT r.review_id::INT, r.rating, r.summary, r.recommend, NULLIF(r.response, 'null') AS response, r.body, to_timestamp(r.date / 1000) AS date, r.reviewer_name, r.helpfulness,
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

  return db.query(query);
};

const getMeta = (id) => {

  const query = `
    SELECT cr.product_id::TEXT, json_object_agg(ra.rating, ra.count::TEXT) ratings, json_object_agg(rec.recommend, rec.count::TEXT) recommended, json_object_agg(cr.name, cr.obj) characteristics
    FROM (
        SELECT
          recommend, count(*)
          FROM reviews r
          WHERE product_id = ${id}
          GROUP BY recommend
      ) AS rec,
      (
        SELECT
          rating, count(*)
          FROM reviews
          WHERE product_id = ${id}
          GROUP BY rating
      ) AS ra,
      (
        SELECT
          c.product_id, c.name, json_build_object('id', c.characteristic_id, 'value', avg(cr.value)::TEXT) AS obj
          FROM characteristics c
          INNER JOIN characteristic_reviews cr
          ON cr.characteristic_id = c.characteristic_id
          WHERE c.product_id = ${id}
          GROUP BY c.characteristic_id
          ORDER BY c.characteristic_id ASC
      ) AS cr
    GROUP BY cr.product_id
  `;

  return db.query(query);
};

const addReview = (body, date) => {

  const query = `
  WITH ins1 AS (
    INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
    VALUES (${body.product_id}, ${body.rating}, ${date}, ${body.summary}, ${body.body}, ${body.recommend}, false, ${body.name}, ${body.email})
    RETURNING review_id
    )
  , INSERT INTO photos(review_id, url)
    VALUES(review_id, UNNEST(${body.photos}))
  `;

  return db.query(query);
}

module.exports = {
  getReviews,
  getMeta,
  addReview,
};
