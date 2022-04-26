import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  scenarios : {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 200,
      maxVUs: 400
    }
  }
};

export default () => {
  let id = Math.floor(Math.random(999999))

  const responses = http.batch([
    ['GET', `http://localhost:3001/reviews?product_id=${id}`],
    ['GET', `http://localhost:3001/reviews/meta?product_id=${id}`]
  ]);

};

