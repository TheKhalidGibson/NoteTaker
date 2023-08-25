const express = require('express');
const path = require('path');

const fs = require('fs/promises');

let db = require('./db/db.json')

const uuid = require('./helpers/uuid');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// the following code is all of my gets
app.get('/api/notes', (req, res) => {
    res.json(db)
})

// the following code is all of my posts

app.post('/api/notes', (req, res) => {
    // Logs that POST request was received
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text,
            id: uuid(),
        };
        db.push(newNote)

        const dbString = JSON.stringify(db, null, 2)

        fs.writeFile(`./db/db.json`, dbString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Post for ${newNote.title} has been written to JSON file`
                )
        );

        // this line was creating duplicates
        // readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }


});

// DELETE Route for a specific tip
app.delete('/api/notes/:review_id', (req, res) => {
    const titleId = req.params.review_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            console.log(json)
            // Make a new array of all tips except the one with the ID provided in the URL
            db = json.filter((title) => title.id !== titleId);
                console.log(db)
            // Save that array to the filesystem
            fs.writeFile(`./db/db.json`, JSON.stringify(db, null, 2))
            .then (() =>{
               return res.status(200).json(db)
            }).catch(err =>console.log(err))
            
            // Respond to the DELETE request
            
        })
});


app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)



app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);