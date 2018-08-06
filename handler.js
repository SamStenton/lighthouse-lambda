const lighthouse = require('lighthouse');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const ReportGenerator = require('./node_modules/lighthouse/lighthouse-core/report/report-generator.js');

module.exports.main = (event, context, callback, chrome) => {
  
  // TODO: Return URL of report before it is available

  return runLighthouse(event.queryStringParameters.url, chrome)
  .then(res => {
    // No longer need chrome after report completed
    chrome.kill();

    // Generate HTML Report
    const html = ReportGenerator.generateReportHtml(res.lhr);

    // Store in S3
    storeReport(html);

  })
};

/**
 * Run the Google Lighthouse check
 * @param {url} url 
 * @param {Chrome} chrome 
 */
const runLighthouse = (url, chrome) => {
  return lighthouse(url, { port: chrome.port })
    .catch(error => {
      console.log(error);
  })
}

const storeReport = (html) => {
  return s3.putObject({
    Bucket: 'lighthouse-chkr',
    Key: 'pwa.html',
    Body: ReportGenerator.generateReportHtml(res.lhr),
    ContentType: 'text/html',
    ACL: 'public-read'
  })
  .promise()
  .catch(error => {
    console.log(error);
  });
}
