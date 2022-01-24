const fs = require("fs");

const writeNote = (path, content) => {
    fs.writeFile(
        path,
        JSON.stringify(content),
        (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
    )
};

module.exports = writeNote;