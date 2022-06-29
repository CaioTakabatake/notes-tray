const jsonfile = require('jsonfile-promised');

module.exports = {
    saveNote(note, description) {
        const pathJson = `${__dirname}/notes.json`;
        jsonfile.readFile(pathJson).then(async file => {
            file.push({
                note,
                description
            });

            jsonfile.writeFile(pathJson, file);
        })
    },
    getAllNote() {
        const pathJson = `${__dirname}/notes.json`;
        return jsonfile.readFile(pathJson);
    },
    removeNote(id) {
        const pathJson = `${__dirname}/notes.json`;
        jsonfile.readFile(pathJson).then(async file => {
            let note = file.filter(item => item.id !== id);

            jsonfile.writeFile(pathJson, note);
        });
    },
    update(notes) {
        const pathJson = `${__dirname}/notes.json`;
        jsonfile.readFile(pathJson).then(async file => {
            jsonfile.writeFile(pathJson, notes);
        });
    }
}