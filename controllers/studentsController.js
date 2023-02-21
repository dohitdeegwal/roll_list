const Student = require('../models/student.js');

const homePage = (req, res) => {
    // fetch distinct departments from db and render home page
    Student.distinct('dept').exec((err, depts) => {
        if (err) {
            console.log(err);
            res.status(500).render('error', { message: 'Internal Server Error' });
            return;
        }
        res.render('home', { depts: depts });
    });
}

const searchStudents = (req, res) => {

    // filter data by query params (if any) through regex for name and dept and roll, and exact match for year
    const filter = {};
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
    Student.find(filter).sort({ roll: 1 }).exec((err, students) => {
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
    });
};

module.exports = {
    searchStudents,
    homePage
};
