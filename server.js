const express = require('express');
const path = require('path');

const fs = require('fs/promises') 

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

app.get('/api/notes', (req, res) =>{
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



app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);