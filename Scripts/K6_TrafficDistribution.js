import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const TRAFFIC_SPLIT = {
    home: 0.5, // 50% of traffic will go to home page
    news: 0.3, // 30% of traffic will go to news page
    blogs: 0.2, // 20% of traffic will go to blogs page
}

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
    const random = Math.random();
    if (random < TRAFFIC_SPLIT.home) {
        group('open home page', () => {
            const response = http.get(BASE_URL);
            check(response, {
                'status is 200': (r) => r.status === 200,
                'body is not empty': (r) => r.body.length > 0, // size ( === 11 )
            });

        });

        sleep(1)
    }

    else if (random < TRAFFIC_SPLIT.home + TRAFFIC_SPLIT.blogs) {
        group('open news page', () => {
            const response = http.get(`${BASE_URL}/news.php`);
            check(response, {
                'news loaded correctly': (r) => r.status === 200,

            });
        });
        sleep(1)
    }
    else {
        group('open blogs page', () => {
            const response = http.get(`${BASE_URL}/blogs/`);
            check(response, {
                'blogs loaded correctly': (r) => r.status === 200,

            });
        });
        sleep(1)
    }
}
    export function handleSummary(data) { // explicitly display the function to K6 by handling the summary of the test results
        return {  // return an object with the report file name with generated HTML report
            "report2.html": htmlReport(data),
        }
    }
