var mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
var Schema = mongoose.Schema;

const dbUser = process.env.atlasUser;
const dbPass = process.env.atlasPassword;
const clusterName = process.env.atlasClusterName;
const dbName = 'StudentDetails';
const dbURI = `mongodb+srv://${dbUser}:${dbPass}@${clusterName}/${dbName}`;
const PORT = 3000;

mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    })
    .catch((err) => console.log(err));

var studentSchema = new Schema({
    roll: Number,
    name: String,
    dept: String,
    year: Number,

});

var Student = mongoose.model('Student', studentSchema);

var app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// health check
app.get('/health', function(req, res) {
    res.send('OK');
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/search', function(req, res) {

    // filter data by query params (if any) through regex for name and dept and roll, and exact match for year
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
    Student.find(filter, function(err, students) {
        if (err) {
            res.status(500).send('Error in DB');
            return;
        }
        if (students.length === 0) {
            res.status(404).send('No Data Found');
            return;
        }

        res.render('search', { students: students });
    });


});


// 404 page
app.use(function(req, res) {
    res.status(404).send('404: Page not Found');
});