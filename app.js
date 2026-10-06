
let notes = []
let editingNoteId = null

const DEFAULT_NOTE_COLOR = '#3b3f4f'; 

function loadNotes() {
  const savedNotes = localStorage.getItem('quickNotes')
  return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event) {
  event.preventDefault()

  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  const color = document.getElementById('colorPicker').value; 

  if(editingNoteId) {
    const noteIndex = notes.findIndex(note => note.id === editingNoteId)
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
      color: color 
    }
  } else {
    notes.unshift({
      id: generateId(),
      title: title,
      content: content,
      color: color 
    })
  }

  closeNoteDialog()
  saveNotes()
  renderNotes()
}

function generateId() {
  return Date.now().toString()
}

function saveNotes() {
  localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function deleteNote(noteId) {
  notes = notes.filter(note => note.id != noteId)
  saveNotes()
  renderNotes()
}

function esColorClaro(hex) {
  if (!hex) return false;
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminosidad = (r * 280 + g * 587 + b * 110) / 1000;
  return luminosidad > 138; 
}

function renderNotes() {
  const notesContainer = document.getElementById('notesContainer');

  if(notes.length === 0) {
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>Sin notas</h2>
        <p>Añade tu primera nota para comenzar</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Añadir tu primera nota</button>
      </div>
    `
    return
  }

  notesContainer.innerHTML = notes.map(note => {
    // oscurecer letra aca
    const claseClaridad = esColorClaro(note.color) ? 'nota-clara' : '';

    return `
      <div class="note-card ${claseClaridad}" style="background-color: ${note.color || DEFAULT_NOTE_COLOR}">
        <h3 class="note-title">${note.title}</h3>
        <p class="note-content">${note.content}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button class="delete-btn" onclick="deleteNote('${note.id}')" title="borrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('')
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById('noteDialog');
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');
  const colorInput = document.getElementById('colorPicker'); 

  if(noteId) {
    const noteToEdit = notes.find(note => note.id === noteId)
    editingNoteId = noteId
    document.getElementById('dialogTitle').textContent = 'Editar Nota'
    titleInput.value = noteToEdit.title
    contentInput.value = noteToEdit.content
    colorInput.value = noteToEdit.color || DEFAULT_NOTE_COLOR
  }
  else {
    editingNoteId = null
    document.getElementById('dialogTitle').textContent = 'Añadir nueva nota'
    titleInput.value = ''
    contentInput.value = ''
    colorInput.value = DEFAULT_NOTE_COLOR 
  }

  dialog.showModal()
  titleInput.focus()
}

function closeNoteDialog() {
  document.getElementById('colorPicker').value = DEFAULT_NOTE_COLOR;
  document.getElementById('noteForm').reset();
  document.getElementById('noteDialog').close();
}

function toggleTheme() {}
function applyStoredTheme() {}

document.addEventListener('DOMContentLoaded', function() {
  applyStoredTheme()
  notes = loadNotes()
  renderNotes()

  document.getElementById('noteForm').addEventListener('submit', saveNote)
  
  if (document.getElementById('themeToggleBtn')) {
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)
  }

  if (document.getElementById('resetColorBtn')) {
    document.getElementById('resetColorBtn').addEventListener('click', function() {
      document.getElementById('colorPicker').value = DEFAULT_NOTE_COLOR;
    })
  }

  document.getElementById('noteDialog').addEventListener('click', function(event) {
    if(event.target === this) {
      closeNoteDialog()
    }
  })
})