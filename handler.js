const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();


module.exports.main = (event, context, callback) => {
  const url = event.queryStringParameters.url;
  const key = extractHostname(url) + `/test_${new Date().getTime()}.html`

  // So the request doesn't hang we fire another lambda to work in the background
  lambda.invoke({
    FunctionName: process.env.LIGHTHOUSE_FUNC,
    InvocationType: "Event",
    Payload: JSON.stringify({url: url, key: key})
  }, (error) => console.log(error));

  // The url of the eventual report is returned.
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ key: key, url: process.env.REPORT_BUCKET_URL + key, message: 'Your report will be live in ~60 seconds'})
  });
};

/**
 * Get the hostname of a url
 * @param {String} url 
 */
const extractHostname = (url) => {
  let hostname;

  // Find & remove protocol (http,https) and get hostname
  url.indexOf("//") > -1 ? hostname = url.split('/')[2] : hostname = url.split('/')[0];

  // Find & remove port number
  hostname = hostname.split(':')[0];
  // Find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}