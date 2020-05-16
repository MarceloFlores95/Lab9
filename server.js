const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose')
const { DATABASE_URL, PORT, TOKEN } = require('./config');

const jsonParser = bodyParser.json();
const validateToken = require('./middleware/validateToken')

// Express se usa para crear endpoints.
// Morgan help to send message of GET/POST/DELETE in terminal, locks what is going in the endpoints
// bodyParser is necessary to send data to the body request
// Uuid: This is a Node package that the bookmarks app data structure will require 
// to generate unique ids. Its to create Cryptographically-strong random values
// Mongoose is node package for connection to the database

const {Bookmark} = require('./models/bookmarkModel')
const app = express();

app.use( express.static( "public" ) );
app.use(morgan('dev')) 
app.use(validateToken)

app.get('/bookmarks',(req, res) => {
    console.log('GET request of all bookmarks')
    Bookmark
        .getAllBookmarks()
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err =>{
            res.statusMessage = "Something is wrong with the Database. Try again later."
            return res.status(500).end();
        })
})

app.get('/bookmark',(req, res) => {
    console.log("GET for one bookmark given the title as parameter.");
    console.log(req.query);
    
    let title = req.query.title;

    if (!title) {
        res.statusMessage = "The 'title' is missing in the querystring";
        return res.status(406).end();
    }

    Bookmark
        .getByTitleBookmark(title)
        .then(result => {
            if(!result) {
                res.statusMessage=`There is no bookmark with this title '${title}'`;
                return res.status(404).end();
            } else {
                return res.status(200).json(result);
            }
        })
})

app.post('/bookmarks', jsonParser,(req,res) => {
    console.log("POST of a new bookmark")
    console.log("Body", req.body);

    let id = uuid.v4();
    let title =req.body.title;
    let description = req.body.description;
    let url =req.body.url;
    let rating = req.body.rating;

    if(!title || !description || !url || !rating) {
        res.statusMessage = "One or more of these parameters is missing in the request: 'title', 'description', 'url', 'rating'";
        return res.status(406).end()
    }
    rating = Number(rating);

    if(isNaN(rating)) {
        res.statusMessage = "The 'raiting' must be a number or is missing";
        return res.status(406).end()
    }

    let newBookmark = {
        id,
        title,
        description,
        url,
        rating
    };

    Bookmark
        .createBookmark(newBookmark)
        .then(result => {
            // Handle id duplicate error
            if(result.errmsg) {
                return res.status(400).end()
            }
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })
})

app.delete('/bookmark/:id', (req,res) => {
    console.log("DELETE of a bookmark")
    console.log(req.params)
    let id = req.params.id

    Bookmark
        .deleteBookmark(id)
            .then(result => {
                if (!result) {
                    res.statusMessage = "The bookmark doesn´t exist";
                    return res.status(404).end();
                } else {
                    return res.status(200).end();
                }
            })
            .catch(err => {
                res.statusMessage = "Something is wrong with the Database. Try again later."
                return res.status(500).end();
            })
})

app.patch('/bookmark/:id',jsonParser,(req,res) => {
    console.log("PATCH of a bookmark");
    console.log(req.body)

    let idParam = req.params.id
    let idBody = req.body.id

    if(!idBody) {
        res.statusMessage = "The 'id' is missing in the body"; 
        return res.status(406).end();
    }

    if(idBody != idParam) {
        res.statusMessage = "The 'id' in the body isn´t the same as the param"; 
        return res.status(409).end();
    }

    Bookmark
        .updateBookmark(req.body)
            .then(result => {
                return res.status(202).json(result); 
            })
            .catch(err => {
                return err
            })
})

app.listen(PORT, () => {
    console.log("This server is running on port 8080")

    new Promise((resolve, reject) => {
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        };
        mongoose.connect(DATABASE_URL, settings,(err) => {
            if(err) {
                return eject(err);
            }
            else {
                console.log("Database connected succesfully")
                return resolve();
            }
        })
    })
})


// Base url: http://localhost:8080
// GET all bookmarks: http://localhost:8080/bookmarks
// GET bookmarks by title: http://localhost:8080/bookmark?id=123
// POST bookmarks: http://localhost:8080/bookmarks
/*
{
    "title": "PostedBookmark",
    "description": "This is a postedBookmark with post",
    "url": "www.postedBookmark.com/6",
    "rating": 4
}
*/
// DELETE bookmarks: http://localhost:8080/bookmark/:id
// PATCH bookmarks: http://localhost:8080/bookmark/:id


