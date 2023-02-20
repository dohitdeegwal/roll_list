const Student = require('../models/student.js');

const searchStudents = (req, res) => {

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
        res.status(400).render('error', { message: 'No filter provided' });
        return;
    }

    // find data from db, also handle if no data found
    Student.find(filter, function(err, students) {
        if (err) {
            console.log(err);
            res.status(500).render('error', { message: 'Internal Server Error' });
            return;
        }
        if (students.length === 0) {
            res.status(404).render('error', { message: 'No data found' });
            return;
        }

        res.render('search', { students: students });
    }).sort({ roll: 1 });
};

module.exports = {
    searchStudents
};
