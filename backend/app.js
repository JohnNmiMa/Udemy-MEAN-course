const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // Start the express app

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    res.status(201).json({
        message: 'Post added sucessfully'
    })
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: 'fkdlaljgjglaj', title: 'First server-side post', content: 'This is coming form the server'},
        { id: 'fkdlaljgjglak', title: 'Second server-side post', content: 'This is coming form the server'}
    ];
    res.status(200).json({
        message: 'Posts fetched succesfully',
        posts: posts
    })
});

module.exports = app;
