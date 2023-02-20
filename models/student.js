const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var studentSchema = new Schema({
    roll: Number,
    name: String,
    dept: String,
    year: Number,

});

var Student = mongoose.model('Student', studentSchema);

module.exports = Student;