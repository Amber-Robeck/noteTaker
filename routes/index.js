const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('../helpers/uuid')
const writeNote = require('../helpers/helpers')
const util = require('util');
//relative file path for data from server.js
const db = require("../db/db.json");
const filename = "./db/db.json"
const path = require('path');
const readFromFile = util.promisify(fs.readFile);

app.get('/notes', (req, res) => {
    // Send a message to the client
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

app.post('/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    // If all the required properties are present
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
                writeNote(filename, parsedNotes)
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
            // Write deleted notes back to the file
            writeNote(filename, parsedNotes);
        }
    });
    //redirect to update deleted notes
    res.redirect("/notes")
});


module.exports = app;