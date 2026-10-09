import http from 'k6/http'
import { sleep, check, group } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


const BASE_URL = __ENV.BASE_URL || 'http://test.k6.io';

export const options = {
    vus: 3,
    duration: '10s',

    thresholds: {

        http_req_duration: ['p(95)<500'],

    }
};

export default function () {
    group('open home page', () => {
        const response = http.get(BASE_URL);
        check(response, {
            'status is 200': (r) => r.status === 200,
            'body is not empty': (r) => r.body.length > 0,
        });
    });
    sleep(1)

    group('open news page', () => {
        const response = http.get(`${BASE_URL}/news.php`);
        check(response, {
            'news loaded correctly': (r) => r.status === 200,

        });
    });
    sleep(2)

    group('open blogs page', () => {
        const response = http.get(`${BASE_URL}/blogs/`);
        check(response, {
            'blogs loaded correctly': (r) => r.status === 200,

        });
    });
    sleep(1)
}
export function handleSummary(data) { // explicitly display the function to K6 by handling the summary of the test results
    return {  // return an object with the report file name with generated HTML report
        "report.html": htmlReport(data),
    }
}



// 'ctrl+backtick' key for terminal