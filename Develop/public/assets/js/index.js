let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;       // Save note button - Navbar
let newNoteBtn;       // Create new note button - Navbar
let noteList;
let clearBtn;       // Clear note - Navbar


if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');      // List of notes to the left
}


// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};


// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};


// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });


const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });


const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });


const renderActiveNote = () => {
  hide(saveNoteBtn);                      // Hides the save Note Btn
  hide(clearBtn);                        // Hides the clear Btn

  if (activeNote.id) {                  // If this saved note with this id exist then
    show(newNoteBtn);                               // Displays the new Note Btn
    noteTitle.setAttribute('readonly', true);       // Set the note Title (on the right-hand side) to Read Only
    noteText.setAttribute('readonly', true);        // Set the note Text area (on the right-hand side) to Read Only
    noteTitle.value = activeNote.title;             // Set note Title value to the saved note title
    noteText.value = activeNote.text;               // Set the note Text area value to the saved note text
  } else {            
    hide(newNoteBtn);               
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};


const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {            // Calls saveNote with our newNote as an argument. SaveNote makes a post fetch request
    getAndRenderNotes();                   // Gets saved notes and displays
    renderActiveNote();
  });
};


// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};


// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};


// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};


// Renders the appropriate buttons based on the state of the form
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {          // If there is not value for note Title or Text then hide the clear btn
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {     // If there is only a note Title or a note Text then hide the save btn
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};


// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {       // Checks to see if we have any saved notes
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();
