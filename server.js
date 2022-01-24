const express = require("express")
const path = require('path');
const fs = require("fs");
const util = require('util');
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");
const PORT = process.env.PORT || 3001;
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);

app.get('/api/notes', (req, res) => {

    // Send a message to the client
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    // res.json(db);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);

    // Destructuring assignment for the items in req.body
    const { title, text, id } = req.body;

    // If all the required properties are present
    if (title && text) {
        // new object to save data
        const newNote = {
            title,
            text,
            id: uuid()
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params)

    //reading current list of notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);

            for (let i = 0; i < parsedNotes.length; i++) {

                if (parsedNotes[i].id == req.params.id) {
                    // Splice on index position, and then deletes 1 at that index
                    parsedNotes.splice(i, 1);
                }
            }


            // Write deleted notes back to the file
            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully deleted notes!')
            );
        }
    });
    //this is working however, only on page refresh
});


///listen to port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
