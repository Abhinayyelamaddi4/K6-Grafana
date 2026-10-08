import http from 'k6/http' // import http module from k6 to work on HTTP request-types --> GET ,PUT ,POST ,PATCH ,DELETE ,OPTIONS ,HEAD requests
import { sleep } from 'k6' // import the sleep function from k6 to pause execution for a specific duration

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// import the htmlReport function from an external URL to generate HTML reports

export default function () { // 'export' explicitly displaying function to K6, default function will iterate/ex each virtual user (VU) in the test

    http.get('https://test.k6.io'); // add GET request to the specified URL / API request
    sleep(1)  // breathing time between requests to avoid unrealistic load on server while testing web applications / real world scenarios

}

export function handleSummary(data) { // explicitly display the function to K6 by handling the summary of the test results
    return {  // return an object with the report file name with generated HTML report
        "report.html": htmlReport(data),
    }
}


// k6 run / k6 run Scripts/K6_Scripts.js
// this is not a browser automation ,
// it is in HTTP-Level not UI-level
// format documentation for k6 script