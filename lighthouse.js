const lighthouseCheck = require('lighthouse');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const ReportGenerator = require('./node_modules/lighthouse/lighthouse-core/report/report-generator.js');

module.exports.main = (event, context, callback, chrome) => {
  return runLighthouse(event.url, chrome)
    .then(res => {
      // No longer need chrome after report completed
      chrome.kill();

      // Generate HTML Report
      const html = ReportGenerator.generateReportHtml(res.lhr);

      // Store in S3
      return storeReport(event.key, html);
    }).catch(error => console.log(error));
};

/**
 * Run the Google Lighthouse check
 * @param {url} url 
 * @param {Chrome} chrome 
 */
const runLighthouse = (url, chrome) => {
  return lighthouseCheck(url, { port: chrome.port })
    .catch(error => console.log(error));
}

const storeReport = (key, html) => {
  return s3.putObject({
    Bucket: process.env.REPORT_BUCKET,
    Key: key,
    Body: html,
    ContentType: 'text/html',
    ACL: 'public-read'
  }).promise().catch(error => console.log(error));
}