const Store = require('electron-store');

module.exports = {
    store: new Store(),
    getAllNote() {
        return this.store.get('dataNotes');
    },
    update(notes) {
        this.store.set('dataNotes', notes);
    }
}