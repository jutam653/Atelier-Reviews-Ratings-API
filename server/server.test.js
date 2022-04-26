const app = require('./index.js')
const supertest = require('supertest');
const request = supertest(app);

describe('Reviews', () => {
  it('gets reviews by product ID', async () => {
    const id = 65660;
    const response = await request.get(`/reviews?product_id=${id}`);
    expect(response.status).toBe(200);
    expect(response._body.product).toBe('65660');
    expect(response._body.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({})
      ])
    );
  });

  it('gets product\'s meta in the same shape', async () => {
    const id = 65660;
    const response = await request.get(`/reviews/meta?product_id=${id}`);
    expect(response.status).toBe(200);
    expect(response._body).toEqual(expect.objectContaining({}));
    expect(response._body.product_id).toBe('65660');
    expect(response._body.ratings).toEqual(expect.objectContaining({}));
    expect(response._body.recommended).toEqual(expect.objectContaining({}));
    expect(response._body.characteristics).toEqual(expect.objectContaining({}));
  });

});

