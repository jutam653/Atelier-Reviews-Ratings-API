DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;

-- create tables for schema

CREATE TABLE IF NOT EXISTS products (
  product_id BIGSERIAL NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS reviews (
  review_id BIGSERIAL NOT NULL PRIMARY KEY,
  product_id INT REFERENCES products(product_id),
  rating INT NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT NOT NULL,
  helpfulness INT NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id BIGSERIAL NOT NULL PRIMARY KEY,
  review_id INT REFERENCES reviews(review_id),
  url TEXT NOT NULL
);

-- hold raw extracted data from csv files

CREATE TABLE IF NOT EXISTS  raw_products (
  product_id BIGSERIAL NOT NULL PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INT
);

CREATE TABLE IF NOT EXISTS characteristics (
  characteristic_id BIGSERIAL NOT NULL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(product_id),
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  characteristic_id INT NOT NULL REFERENCES characteristics(characteristic_id),
  review_id INT NOT NULL REFERENCES reviews(review_id),
  value INT NOT NULL
);

-- copy csv data into raw tables

COPY raw_products
FROM '/Users/julian/Desktop/SDC_data/product.csv'
DELIMITER ',' CSV HEADER;

COPY reviews
FROM '/Users/julian/Desktop/SDC_data/reviews.csv'
DELIMITER ',' CSV HEADER;

COPY photos
FROM '/Users/julian/Desktop/SDC_data/reviews_photos.csv'
DELIMITER ',' CSV HEADER;

COPY characteristics
FROM '/Users/julian/Desktop/SDC_data/characteristics.csv'
DELIMITER ',' CSV HEADER;

COPY characteristic_reviews
FROM '/Users/julian/Desktop/SDC_data/characteristic_reviews.csv'
DELIMITER ',' CSV HEADER;

INSERT INTO products (product_id)
SELECT DISTINCT product_id
FROM raw_products;

-- product
SELECT product_id
FROM products
WHERE product_id = 2;

-- reviews
SELECT review_id, rating, summary, recommend, response, body, to_timestamp(date / 1000), reviewer_name, helpfulness
FROM reviews AS RESULTS
WHERE product_id = 65660;

-- photos
SELECT json_build_object('id', p.photo_id, 'url', url) AS photos
FROM photos
INNER JOIN reviews
ON reviews.review_id = photos.review_id
WHERE product_id = 65660;

-- reviews/photos
SELECT r.review_id, r.rating, r.summary, r.recommend, NULLIF(r.response, 'null') AS response, r.body, to_timestamp(r.date / 1000) AS date, r.reviewer_name, r.helpfulness,
COALESCE(json_agg(
  json_build_object('id', p.photo_id, 'url', p.url)
) FILTER (WHERE p.photo_id IS NOT NULL), '[]') photos
FROM photos p
RIGHT OUTER JOIN reviews r
ON r.review_id = p.review_id
WHERE r.product_id = 65660
GROUP BY r.review_id
ORDER BY r.helpfulness DESC;

-- ratings
SELECT json_object_agg(r.rating, r.count) ratings
FROM (
	SELECT
		rating, count(*) AS count
		FROM reviews
		WHERE product_id = 1
		GROUP BY rating
	) AS r;

-- ratings + recommended
SELECT json_object_agg(ra.rating, ra.count) ratings, json_object_agg(rec.recommend, rec.count) recommended
FROM (
	SELECT
		recommend, count(*)
		FROM reviews
		WHERE product_id = 65660
		GROUP BY recommend
	) AS rec,
	(
	SELECT
		rating, count(*)
		FROM reviews
		WHERE product_id = 65660
		GROUP BY rating
	) AS ra;

--
SELECT c.name, json_build_object('id', c.characteristic_id, 'value', avg(cr.value))
FROM characteristics c
INNER JOIN characteristic_reviews cr
ON cr.characteristic_id = c.characteristic_id
WHERE c.product_id = 1
GROUP BY c.characteristic_id;









