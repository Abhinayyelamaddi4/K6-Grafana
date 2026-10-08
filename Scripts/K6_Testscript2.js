import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://test.k6.io';

export const options = {
    // ramp-up = users joining , ramp-down =users leaving 
    stages: [
        { duration: '5s', target: 3 }, // ramp-up stage --> virtual users will ramp up gradually to 5
        { duration: '10s', target: 3 }, // steady stage  --> test will run with maximum load
        { duration: '5s', target: 0 }, // ramp-down stage] --> virtual users will ramp down gradually to 0 and test will end
    ],

    thresholds: {

        http_req_duration: ['p(95)<500'],

    }
};

export default function () {
    const response = http.get(BASE_URL);
    check(response, {
        'status is 200': (r) => r.status === 200,
        'body is not empty': (r) => r.body.length > 0, 
       // 'body size is 11':(r) => r.body.length === 11
        
    });
    sleep(1)
}

// 'ctrl+backtick' key for terminal