const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
// const addNote = fs.createWriteStream('./db/db.json', { flags: 'a'})      // Creates a writable stream to the file passed as an argument. The a flag tells it were appending to the file

notes.get('/', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {                  // if there's an error console logs the error
            console.error(err);
        }
        res.json(JSON.parse(data))      // Since readFile returns a string we convert to an object and then back to json. We attach this to the response
    })
})

notes.post('/', (req, res) => {
    const {title, text} = req.body;      //Object deconstructuring - same as doing title = req.body.title
    
    if (title && text) {                // Checks to see that both title and text exist
        const newNote = {               // Creates a newNote object where the title key has title (req.body.title) as a value and the text key has text (req.body.text) as a value
            title,                      
            text,
            note_id: uuidv4()           // calls uuidv4 to create a universally unique identifier for each note posted
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {                  // if there's an error console logs the error
                console.error(err);
            }

            let savedNotes = JSON.parse(data);
            savedNotes.push(newNote)                   // Appends the new Note at the end of the array in db.json
            
            fs.writeFile('./db/db.json', JSON.stringify(savedNotes, null, 4), (error) => {  // Converts the array to a string and indents by 4 spaces
                if (error) {
                    console.error(error);
                }
            })
        })

        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);             // Sends the response object as a json string
    } else {
        res.json('Error saving note')       // Sends an error message as a json string attached to the res object
    }
})

// notes.delete('/', (req, res) => {

// })

module.exports = notes;








// if (savedNotes === 'undefined' || savedNotes === 'null') {      // Checks to see if the db.json file is empty
//     let notesArray = [];                                        // If empty then it creates an array and pushes the new Note to the array
//     notesArray.push(newNote)
//     addNote.write(JSON.stringify(notesArray));         // writes to the db.json file
// } else {
//     savedNotes.push(newNote)                   // Appends the new Note at the end of the array in db.json
//     addNote.write(JSON.stringify(savedNotes));         
// }