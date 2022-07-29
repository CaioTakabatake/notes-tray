const { app, Tray, Menu, BrowserWindow, ipcMain, Notification } = require('electron');
const { resolve } = require('path');
const notesJson = require('./notes');

let tray;
let win;
let addNote;
let view;

const render = async (tray) => {
  let notes = [];
  const dataNotes = await notesJson.getAllNote();

  dataNotes.map((note, id) => {
    notes.push({
      label: note.title,
      type: 'submenu',
      submenu: [
        {
          label: 'View note',
          type: 'normal',
          click: () => {
            if (!view) {
              view = new BrowserWindow({ width: 400, height: 500, frame: false, resizable: true, webPreferences: { additionalArguments: [`--note-id=${id.toString()}`], nodeIntegration: true, contextIsolation: false } })
              view.loadFile('window/view/index.html');
              view.on('closed', () => { view = ''; });
            }
          }
        },
        {
          label: 'Remove note',
          type: 'normal',
          click: () => {
            dataNotes.splice(id, 1);
            notesJson.update(dataNotes);
            new Notification({ title: 'NOTA REMOVIDA', body: `A NOTA ${note.title} FOI REMOVIDA!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()
            setTimeout(() => { render(tray); }, 100);
          }
        }
      ],
    });
  });

  const contextMenu = new Menu.buildFromTemplate([
    {
      label: 'Add Note',
      type: 'normal',
      click: async () => {
        if (!addNote) {
          addNote = new BrowserWindow({ width: 400, height: 500, frame: false, resizable: false, webPreferences: { nodeIntegration: true, contextIsolation: false } })
          addNote.loadFile('window/add-note/index.html');
          addNote.on('closed', () => { addNote = ''; });
        }
      }
    },
    {
      label: 'Open Menu',
      type: 'normal',
      click: async () => {
        if (!win) {
          win = new BrowserWindow({ width: 1600, height: 900, frame: false, resizable: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });
          win.loadFile('window/main/index.html');
          win.on('closed', () => { win = ''; });
        }
      }
    },
    {
      type: 'separator'
    },
    ...notes,
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      type: 'normal',
      click: async () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu)
}

app.on('ready', async () => {
  tray = new Tray(resolve(__dirname, 'assets', 'logo.png'));
  render(tray);
});

ipcMain.on('update-add-note', (evt, note) => {
  new Notification({ title: 'NOTA ADICIONADA', body: `A NOTA ${note} FOI CRIADA!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()

  render(tray);
});

ipcMain.on('update-deleted', (evt, note) => {
  new Notification({ title: 'NOTA REMOVIDA', body: `A NOTA ${note} FOI REMOVIDA!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()

  render(tray);
});

ipcMain.on('update-edit-note', (evt, note) => {
  new Notification({ title: 'NOTA EDITADA', body: `A NOTA ${note} FOI EDITADA!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()

  render(tray);
});

app.on('window-all-closed', () => { });