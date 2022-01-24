const express = require('express');
const app = express();
const fs = require('fs');

const uuid = require('../helpers/uuid')
const writeNote = require('../helpers/helpers')
const util = require('util');
//relative file path for data
const db = require("../db/db.json");
//still not sure about this one
const filename = "./db/db.json"

const path = require('path');
console.log(filename)






const readFromFile = util.promisify(fs.readFile);
app.get('/notes', (req, res) => {

    // Send a message to the client
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
    // res.json(db);

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

app.post('/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);

    console.log(req.body);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // // If all the required properties are present
    if (title && text) {
        // new object to save data
        const newNote = {
            title,
            text,
            id: uuid()
        };

        // Obtain existing notes
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    filename,
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

app.delete('/notes/:id', (req, res) => {
    console.log(req.params)

    //reading current list of notes
    fs.readFile(filename, 'utf8', (err, data) => {
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
            console.log(parsedNotes);


            //             // Write deleted notes back to the file
            writeNote(filename, parsedNotes);
            //             // fs.writeFile(
            //             //     './db/db.json',
            //             //     JSON.stringify(parsedNotes),
            //             //     (writeErr) =>
            //             //         writeErr
            //             //             ? console.error(writeErr)
            //             //             : console.info('Successfully deleted notes!')
            //             // );
        }
    });
    // res.json({ msg: "deleted" })
    res.redirect("/notes")
    //     //this is working however, only on page refresh
});


module.exports = app;