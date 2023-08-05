// Create web server 
// Start server: node comments.js
// Test: curl -X POST -H "Content-Type: application/json" -d '{"author":"Scott","text":"This is my first comment"}' http://localhost:8080/api/comments
// Test: curl http://localhost:8080/api/comments

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./model/comments');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 8080;

//db config
mongoose.connect('mongodb://localhost:27017/comments');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To prevent errors from Cross Origin Resource Sharing, set headers to allow CORS with middleware
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Test route
router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

// Adding the /comments route to our /api router
router.route('/comments')
    // retrieve all comments from the database
    .get(function(req, res) {
        // Looks at our Comment Schema
        Comment.find(function(err, comments) {
            if (err)
                res.send(err);
            // responds with a json object of our database comments.
            res.json(comments)
        });
    })
    // post new comment to the database
    .post(function(req, res) {
        var comment = new Comment();
        // body parser lets us use the req.body
        comment.author = req.body.author;
        comment.text = req.body.text;
        comment.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Comment successfully added!' });
        });
    });

// Use our router configuration when we call /api
app.use('/api', router);

// Start the server and listen on port
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});

