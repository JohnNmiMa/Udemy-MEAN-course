const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post'); // a mongoose model setup to talk to the mongoDB.

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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save(post).then(createdPost => {
        res.status(201).json({
            message: 'Post added sucessfully',
            postId: createdPost._id
        })
    });
});

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched succesfully',
                posts: documents
            })
        });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then((result) => {
            res.status(200).json({message: `Post ${req.params.id} deleted!`});
        })
});

module.exports = app;
