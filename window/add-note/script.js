const notesJson = require('../../notes');
const { ipcRenderer } = require('electron');

popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
let isUpdate = false, updateId;


titleTag.focus();
popupTitle.innerText = "Add a new Note";
addBtn.innerText = "Add Note";
popupBox.classList.add("show");
document.querySelector("body").style.overflow = "hidden";
if (window.innerWidth > 660) titleTag.focus();


closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
  setTimeout(() => {
    window.close();
  }, 100);
});

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
      } else {
        isUpdate = false;
        notes[updateId] = noteInfo;
      }
      notesJson.update(notes);
      setTimeout(() => {
        console.log('Oi')
        ipcRenderer.send('update-add-note', noteInfo.title);
        window.close();
      }, 100);
      closeIcon.click();
    }
  }
  load()
});