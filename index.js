var mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const mainRouter = require('./routes.js');

const dbUser = process.env.atlasUser;
const dbPass = process.env.atlasPassword;
const clusterName = process.env.atlasClusterName;
const dbName = 'StudentDetails';
const dbURI = `mongodb+srv://${dbUser}:${dbPass}@${clusterName}/${dbName}`;
const PORT = 3000;

mongoose.set('strictQuery', true);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    })
    .catch((err) => {
        console.log(err);
    });

var app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(mainRouter);