const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createuser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'user created!',
                        result: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: "invalid authentication credentials!"
                    });
                });
        });
};

exports.userLogin = (req, res, next) => {
    // A multi-step process to validate a user login and create a token to be sent back.
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        console.log("### user =");
        console.log(user);
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed."
            })
        }

        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: "Authentication failed!"
            });
        }

        // The user exists in the DB, and it's password is correct (according to bcrypt.compare().
        // Now, let's create the JSON Web-token.
        const token = jwt.sign(
            {email: fetchedUser.email, userId: fetchedUser._id},
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        })
    })
    .catch(err => {
        message: "Invalid authentication credentials!";
    })
};
