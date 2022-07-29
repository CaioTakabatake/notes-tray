const Store = require('electron-store');

module.exports = {
    store: new Store(),
    getAllNote() {
        const data = this.store.get('dataNotes');
        if (!data) return [];
        return data
    },
    update(notes) {
        this.store.set('dataNotes', notes);
    }
}