const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');

const app = express(); // Start the express app

// Connect to the mongodb with the connection string from MongoDB Atlas
// This connection was changed to write to the 'node-angular' db
mongoose.connect('mongodb+srv://jmarks:please0pmo@markscluster0-mcbsj.mongodb.net/node-angular?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to mongodb database');
    })
    .catch(() => {
        console.log('Connected to mongodb database failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join('backend/images'))); // allow any requests that have "/images" to work

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/posts', postRoutes);

module.exports = app;
