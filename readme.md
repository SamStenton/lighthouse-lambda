# Run Google Lighthouse audits in AWS Lambda

Google Lighthouse is cool but do you know what's even cooler? Running them in Lambda. 

## Setup
The Lambda setup is done via the Serverless framework so make sure we have that installed.  

```bash
npm install -g serverless
```

Next you'll need to clone and install this repo

```bash
git clone https://github.com/SamStenton/lighthouse-lambda
cd lighthouse-lambda
npm install
```
This installs the Google Lighthouse package along with the serverless chrome plugin.

While installing you'll need to edit your `config.yml` file.
```yaml
reportBucket: 'nameOfTheBucketYouWantToCreate' 

...
```

## Access Keys
In order to connect to AWS services you'll need to create some access keys. To do this follow the guide on the [serverless docs](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

## Deployment
Once you have setup access to your AWS account deployment is easy via the serverless framework.
```bash
serverless deploy
```
This will create a CloudFormation Template and create:
* Lambda Main
* Lambda Lighthouse
* S3 Report Bucket

Once complete you'll get output detailing your new stack. 

If you wish to reverse the above command and remove your functions and bucket simply run
```bash
serverless remove
```

## Usage
Once your deploy command has completed you'll be given output defining what your endpoints are. 
```
https://randomletters.execute-api.eu-west-1.amazonaws.com/dev/check
```
To run a report add a `url` parameter to the end of the endpoint with the website you would like to test.

```
?url=https://pwa.rocks
```

Your response will look like the following:

```json
{
"key": "pwa.rocks/test_1543789776367.html",
"url": "//yourbucket/pwa.rocks/test_1543789776367.html",
"message": "Your report will be live in ~60 seconds"
}
```
After about 30 seconds your report will be available at the url provided in the response. 

## Todo
* Allow authorization headers to be added the Lighthouse request
* Add nice S3 index and 404 templates
* Provide the raw report data






