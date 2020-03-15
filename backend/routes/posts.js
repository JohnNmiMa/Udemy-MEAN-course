const express = require('express');

const Post = require('../models/post'); // a mongoose model setup to talk to the mongoDB.

const router = express.Router();

router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
        .then((result) => {
            res.status(200).json({message: "Update sucessful"});
        })
});

router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched succesfully',
                posts: documents
            })
        });
});

router.get('/:id', (req, res, next) => {
    console.log("request id = " + req.params.id);
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'Post not found!'});
            }
        })
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id})
        .then((result) => {
            res.status(200).json({message: `Post ${req.params.id} deleted!`});
        })
});

module.exports = router;
