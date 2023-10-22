const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const addNote = fs.createWriteStream('./db/db.json', { flags: 'a'})      // Creates a writable stream to the file passed as an argument. The a flag tells it were appending to the file

notes.get('/', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {                  // if there's an error console logs the error
            console.error(err)
        }
        res.json(JSON.parse(data))      // Since readFile returns a string we convert to an object and then back to json. We attach this to the response
    })
})

notes.post('/', (req, res) => {
    const {title, text} = req.body      //Object deconstructuring - same as doing title = req.body.title
    
    if (title && text) {                // Checks to see that both title and text exist
        const newNote = {
            title,
            text,
            note_id: uuidv4()           // calls uuidv4 to create a universally unique identifier for each note posted
        }

        addNote.write(JSON.stringify(newNote));         // writes to the db.json file
        addNote.end()                   // ends the write stream

        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);             // Sends the response object as a json string
    } else {
        res.json('Error saving note')       // Sends an error message as a json string attached to the res object
    }
})

module.exports = notes;