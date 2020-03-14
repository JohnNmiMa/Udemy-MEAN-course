const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true}
});

// This will be used to write to a collection named 'Posts', the plural form of the model's name
module.exports = mongoose.model('Post', postSchema);
