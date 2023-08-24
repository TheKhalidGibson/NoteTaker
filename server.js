const express = require('express');
const path = require('path');

const fs = require('fs/promises');

const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// the following code is all of my gets
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8')
        .then((data) => {
            console.log(data)
            let notes = JSON.parse(data)
            console.log(notes)
            res.json(notes)
        })
})

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

// the following code is all of my posts

app.post('/notes', (req, res) => {
    // Logs that POST request was received
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    if (title && text) {

        const newNote = {
            title,
            text,
            review_id: uuid(),
        };
        db.push(newNote)

        const dbString = JSON.stringify(db, null,)

        fs.writeFile(`./db/db.json`, dbString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Review for ${newNote.title} has been written to JSON file`
                )
        );

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


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);