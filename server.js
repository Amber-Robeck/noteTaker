const express = require("express")
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const api = require('./routes/index.js');


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', api);


// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for homepage if anything else is typed
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

///listen to port
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
