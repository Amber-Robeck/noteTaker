const express = require("express")
const path = require('path');
const fs = require("fs");
const util = require('util');
const db = require("./db/db.json")
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

// // api route for notes
// app.get('/api/notes', (req, res) => {
//     console.info(`${req.method} request received for notes`);
//     console.log(`${req.method}`);
//     fs.readFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
//     console.log(res.json(JSON.parse(data)))

// });

// // api post route for notes
// app.post('/api/notes', (req, res) => {
//     console.info(`${req.method} request received to add a note`);
//     console.log(req.body);

//     let { title, text } = req.body;
//     const note = {
//         title,
//         text,
//         // note_id: uuid(),
//     };
//     fs.readFile("./db/db.json", 'utf8', (err, data) => {
//         if (err) {
//             console.log(err);
//         } else {
//             const oldNote = JSON.parse(data);
//             oldNote.push(note);
//             fs.writeFile("./db/db.json", JSON.stringify(oldNote))
//         }

//     })
// });

// app.listen(PORT, () =>
//     console.log(`App listening at http://localhost:${PORT} 🚀`)
// );




// const writeIntoFile = util.promisify(fs.writeFile);
// const readFromFile = (filePath, content, res) => {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) throw err;
//         var stuData = JSON.parse(data);
//         stuData.push(content);

//         writeIntoFile(filePath, JSON.stringify(stuData))
//             .catch(err => console.log(err))
//             .then(() => { console.log("data") })
//     })
// }

app.get('/api/notes', (req, res) => {
    // Send a message to the client
    res.status(200).json(`${req.method} request received to get notes`);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };

        // Obtain existing reviews
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

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
