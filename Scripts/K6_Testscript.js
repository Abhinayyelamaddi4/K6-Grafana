import http from 'k6/http'
import { sleep, check } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = __ENV.BASE_URL || 'http://test.k6.io'; // read the value from environmental variables

export const options = { // the word options is reserved keyword in K6
    vus: 3,
    duration: '10s', // add load configuration

    thresholds: {
        http_req_duration: ['p(95) < 250'], // 95% of requests must finish under 300ms of time
        http_req_failed: ['rate<0.05'], // 5% of requests must fail 
        checks: ['rate>=0.9'], // 90% of checks must pass
    }
};

export default function () {
    const response = http.get(BASE_URL);  // add checks and assertions
    check(response, {
        'status is 200': (r) => r.status === 200,    // status is 200 = name of the check , (r) is response object, r.status is the validation logic 
        'body is not empty': (r) => r.body.length > 0, // we can also add --->  response headers , response time ,response body 
    });
    sleep(1)
}


//k6 run -e BASE_URL=http://test.k6.io  Scripts/K6_Testscript.js