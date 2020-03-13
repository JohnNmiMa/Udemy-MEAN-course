const express = require('express');

const app = express(); // Start the express app

// An express app is just a big chain of middlewears that we apply to the incoming requests.
// "use" a new middlewear
app.use((req, res, next) => {
    console.log('First middleware');
    next();
});

app.use((req, res, next) => {
    res.send('Hello from express'); // will explicity end() the response
});

module.exports = app;
