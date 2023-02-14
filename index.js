var mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');

const dbUser = process.env.atlasUser;
const dbPass = process.env.atlasPassword;
const clusterName = process.env.atlasClusterName;
const dbName = process.env.atlasDBName;
const dbURI = `mongodb+srv://${dbUser}:${dbPass}@${clusterName}/${dbName}?retryWrites=true&w=majority`;
const PORT = 3000;

var Schema = mongoose.Schema;

var studentSchema = new Schema({
    roll: Number,
    name: String,
    dept: String,
    year: Number,

});

var Data = mongoose.model('Student', studentSchema);

var app = express();

app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/student', function(req, res) {
    // filter data by query params (if any) through regex for name and dept, and exact match for roll and year
    var filter = {};
    if (req.query.roll) {
        filter.roll = req.query.roll;
    }
    if (req.query.name) {
        filter.name = new RegExp(req.query.name, 'i');
    }
    if (req.query.dept) {
        filter.dept = new RegExp(req.query.dept, 'i');
    }
    if (req.query.year) {
        filter.year = req.query.year;
    }

    // return no data if no filter is provided
    if (Object.keys(filter).length === 0) {
        res.status(400).send('No Filter Provided');
        return;
    }

    // find data from db, also handle if no data found
    Data.find(filter, function(err, data) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            if (data.length) {
                res.json(data);
            } else {
                res.status(404).send('No Data Found');
            }
        }
    });
});

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});

