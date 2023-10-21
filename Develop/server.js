const express = require('express');              // Imports Express.JS
const path = require('path');
// const uuid = require('uuid')

const api = require('./routes/index');          // Imports index.js from routes as api

const PORT = process.env.port || 3001;          // Sets up our PORT number as 3001 or as an environmental variable port number chosen by Heroku

const app = express();


// middleware
app.use(express.json());                        // Takes json and converts from string to object
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);                           // For request that start with a /api look at the api variable

app.use(express.static('public'));             // Middleware for our static files in public folder

app.get('/', (req, res) => {                   // GET Route for the homepage
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {              // GET Route for the notes page
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.listen(PORT, () => {                        // Starts server
    console.log('Server running')
})