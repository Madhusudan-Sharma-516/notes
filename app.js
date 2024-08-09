let createBtn = document.querySelector(".createBtn");
let createNote = document.querySelector(".form-box");
let closeForm = document.querySelector(".closeForm");
let flex = false;

function openForm() {
  if (!flex) {
    createNote.style.display = "block";
    flex = true;
  }
}

closeForm.addEventListener("click", function () {
  createNote.style.display = "none";
  flex = false;
});

let arr = [];

function saveToStorage() {
  const storedArr = JSON.stringify(arr);
  localStorage.setItem("arr", storedArr);
}

function getFromStorage() {
  let storedArr = localStorage.getItem("arr");
  return storedArr ? JSON.parse(storedArr) : [];
}

function initializeNotes() {
  arr = getFromStorage();
  addItemToMain();
}

let titleError = document.querySelector("#titleError");
let noteError = document.querySelector("#noteError");
let formBox = document.querySelector(".form-box");
let formTitle = document.querySelector(".form-box input");
let formNote = document.querySelector(".form-box textarea");
let mainBox = document.querySelector("main section");

function addNoteBox() {
  if (!formTitle.value || formTitle.value.trim() === "") {
    titleError.style.display = 'block';
  } else if (!formNote.value || formNote.value.trim() === "") {
    noteError.style.display = 'block';
  } else {
    titleError.style.display = 'none';
    noteError.style.display = 'none';

    let newItem = {
      title: formTitle.value,
      note: formNote.value
    };

    arr.push(newItem);

    createNote.style.display = "none";
    flex = false;

    formTitle.value = "";
    formNote.value = "";

    saveToStorage();
    mainBox.innerHTML = ""; // Clear existing notes before re-adding
    addItemToMain();
  }
}

function initializeDeleteButtons() {
  let trashBtns = document.querySelectorAll(".fa-trash");

  trashBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      // Remove the note element from the DOM
      btn.parentElement.parentElement.parentElement.remove();

      // Remove the note from the array and update local storage
      arr.splice(index, 1);
      saveToStorage();
    });
  });
}

function initializeEditButtons() {
  let editBtns = document.querySelectorAll(".fa-pen-to-square");

  editBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const noteBox = btn.parentElement.parentElement.parentElement;
      const textarea = noteBox.querySelector("textarea");

      // Enable editing
      textarea.disabled = false;
      textarea.focus();

      // Change icon to "tick"
      btn.classList.remove("fa-pen-to-square");
      btn.classList.add("fa-check");

      // Add a click event for saving the edited note
      btn.addEventListener("click", function saveEdit() {
        // Update the note in the array
        arr[index].note = textarea.value;

        // Save the updated notes to local storage
        saveToStorage();

        // Disable editing
        textarea.disabled = true;

        // Change icon back to "pen"
        btn.classList.remove("fa-check");
        btn.classList.add("fa-pen-to-square");

        // Remove the saveEdit event to prevent adding multiple listeners
        btn.removeEventListener("click", saveEdit);
      });
    });
  });
}

function addItemToMain() {
  mainBox.innerHTML = ""; // Clear the main box to avoid duplicate entries
  arr.forEach((item, index) => {
    const noteBox = document.createElement("div");
    noteBox.classList.add('notebox');

    noteBox.innerHTML = `
    <div class="title-line">
        <h3>${item.title}</h3>
      <div>
        <i class="fa-regular fa-pen-to-square"></i>
        <i class="fa-solid fa-trash"></i>
      </div>
    </div>
    <div class="noteContent">
      <textarea
        spellcheck="false"
        disabled
        >${item.note}</textarea>
    </div>`;

    mainBox.appendChild(noteBox);
  });

  // Initialize delete and edit buttons after adding all notes
  initializeDeleteButtons();
  initializeEditButtons();
}

// Initialize notes when the page loads
initializeNotes();
