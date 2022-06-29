const jsonfile = require('jsonfile-promised');

module.exports = {
    getAllNote() {
        const pathJson = `${__dirname}/notes.json`;
        return jsonfile.readFile(pathJson);
    },
    update(notes) {
        const pathJson = `${__dirname}/notes.json`;
        jsonfile.readFile(pathJson).then(async file => {
            jsonfile.writeFile(pathJson, notes);
        });
    }
}