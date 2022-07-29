const notesJson = require('../../notes');
const { ipcRenderer } = require('electron');
const addBox = document.querySelector(".add-box");

const noteId = Number(window.process.argv.filter(arg => arg.includes('--note-id='))[0].replace('--note-id=', ''))

const global = async () => {
    const notes = await notesJson.getAllNote();

    const note = notes.find((note, id) => id === noteId);

    document.querySelectorAll(".note").forEach(li => li.remove());
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <button onclick="window.close()">Close note</button>
                                <ul class="menu">
                                    <li onclick="updateNote(${noteId}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${noteId})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterbegin", liTag);
}

global();