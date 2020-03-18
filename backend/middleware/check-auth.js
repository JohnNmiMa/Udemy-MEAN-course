const jwt = require('jsonwebtoken');

// Export a fundtion for this module
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token
        jwt.verify(token, 'secret_this_should_be_longer');
        next();
    } catch (error) {
        res.status(401).json({
            message: "Authorization failed"
        });
    }
};

