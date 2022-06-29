const notesJson = require('../../notes');
const { ipcRenderer } = require('electron');

const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

async function showNotes() {
    const notes = await notesJson.getAllNote();

    if (!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id}, '${note.title}')"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

async function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

async function deleteNote(noteId, noteTitle) {
    console.log(noteId)
    const notes = await notesJson.getAllNote();
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    notes.splice(noteId, 1);
    notesJson.update(notes);
    setTimeout(() => {
        showNotes();
        ipcRenderer.send('update-deleted', noteTitle);
    }, 100);
}

async function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    const load = async () => {
        const notes = await notesJson.getAllNote();
        let title = titleTag.value.trim(),
            description = descTag.value.trim();
    
        if (title || description) {
            let currentDate = new Date(),
                month = months[currentDate.getMonth()],
                day = currentDate.getDate(),
                year = currentDate.getFullYear();
    
            let noteInfo = { title, description, date: `${month} ${day}, ${year}` }
            if (!isUpdate) {
                notes.push(noteInfo);
                ipcRenderer.send('update-add-note', title);
            } else {
                isUpdate = false;
                notes[updateId] = noteInfo;
                ipcRenderer.send('update-edit-note', title);
            }
            notesJson.update(notes);
            setTimeout(() => {
                showNotes();
            }, 100);
            closeIcon.click();
        }
    }
    load()
});