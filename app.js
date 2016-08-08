var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');
var bodyParser = require('body-parser');
var aws = require('aws-sdk');

process.env.AWS_ACCESS_KEY_ID = 'your AWS secretKey';
process.env.AWS_SECRET_ACCESS_KEY = 'your AWS accessKey';


app.use(express.static(path.join(__dirname, 'dist'))); // sets public resource paths to dist
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// disable powered by as to hide express signature
app.disable('x-powered-by');

//region config or fail
aws.config.update({ region: 'us-west-2' });

function listAllBuckets() {
    var s3 = new aws.S3();
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error:", err);
            return;
        }

        for (var index in data.Buckets) {
            var bucket = data.Buckets[index];
            console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
        }
        res.status(200).end('asd');
    });
}

function showDynamoTables() {
    var db = new aws.DynamoDB();
    db.listTables(function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data.TableNames);
    });
}

function getItem(res) {
    var db = new aws.DynamoDB();
    var params = {
        AttributesToGet: [
            "password"
        ],
        TableName: 'marius-test-table',
        Key: {
            user: {
                "S": "marius"
            }
        }
    }

    db.getItem(params, function (err, data) {
        if (err) {
            console.log(err); // an error occurred
        }
        else {
            console.log(data); // successful response
            res.send(data);
        }
    });
}

function describeTable(table) {
    var db = new aws.DynamoDB();

    db.describeTable({
        TableName: table
    }, function (err, data) {
        if (err) { console.log('err'); return; }
        console.log(JSON.stringify(data));
    });
}

app.get('/', function (req, res) {
    getItem(res);
    // describeTable('marius-test-table');
});

app.listen(port, function () {
    console.log('Working on port ' + port);
});
