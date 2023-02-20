const express = require('express');
const mainRouter = express.Router();
const studentsController = require('./controllers/studentsController.js');

// main page
mainRouter.get('/', (req, res) => res.render('index') );

// search page
mainRouter.get('/search', studentsController.searchStudents);

// health check
mainRouter.get('/health', (req, res) => res.send('OK') );

// 404 page
mainRouter.use( (req, res) => res.status(404).render('error', { message: 'Page Not Found' }) );

module.exports = mainRouter;