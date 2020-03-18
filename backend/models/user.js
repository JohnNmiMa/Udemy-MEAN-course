const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    // 'unique' property is not a validator. It's there to help mongoose/mongoDB to optimize itself
    // Use the mongoose-unique-validator node package to ensure unique values in the DB
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

// This will validate against unique users.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
