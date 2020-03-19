const jwt = require('jsonwebtoken');

// Export a fundtion for this module
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token
        const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');

        // Add data to the request as middleware. The final request processing function will see this data
        // in the request.
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({
            message: "You are not authenticated!"
        });
    }
};

