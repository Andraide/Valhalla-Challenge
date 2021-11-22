const express = require('express');
const app = express();
const errorHandler = require('./helpers/error-handler');


app.use('/movies', require('./controllers/movies/movies.controller'));
app.use(errorHandler);


// start server
const port = process.env.NODE_ENV === true ? 3000 : 3000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
