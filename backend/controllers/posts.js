const Post = require('../models/post'); // a mongoose model setup to talk to the mongoDB.

exports.createPost = (req, res, next) => {
    const host = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: host + '/images/' + req.file.filename,
        creator: req.userData.userId
    });

    post.save(post).then(createdPost => {
        res.status(201).json({
            message: 'Post added sucessfully',
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });
};

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const host = req.protocol + '://' + req.get('host');
        imagePath = host + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });

    // Post.updateOne will only update a post that has the correct "_id" and "creator"
    // So cool - we let mongoose protect changes to the post for only the creator of the post.
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then((result) => {
            // Might or might not have found a valid post
            if (result.nModified > 0) {
                res.status(200).json({message: "Post update sucessful!"});
            } else if (result.n > 0 & result.nModified === 0) {
                res.status(200).json({message: "Post wasn't different, hence no update was necessary!"});
            } else {
                res.status(401).json({message: "Not authorized to update post!"});
            }
        })
        .catch(error => {
            // This is a technical error, such as a database connetion error
            res.status(500).toJSON({
                message: "Couldn't update post!"
            })
        })
};

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched succesfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed!"
            })
        })
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            // A post was either found or not found.
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'Post not found!'});
            }
        })
        .catch(error => {
            // This error is a technical error.
            res.status(500).json({
                message: "Fetching posts failed!"
            })
        })
};

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
        .then((result) => {
            if (result.n > 0) {
                res.status(200).json({message: `Post ${req.params.id} deleted!`});
            } else {
                res.status(401).json({message: "Not authorized to delete post"});
            }
        })
        .catch(error => {
            // This error is a technical error.
            res.status(500).json({
                message: "Deleting post failed!"
            })
        })
};
