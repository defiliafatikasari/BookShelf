const rakBuku = [];
const RENDER_EVENT = 'tampilkan-rak-buku';

document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    tambahRakBuku();
  });
});

function tambahRakBuku() {
  const title = document.getElementById('titleBuku').value;
  const author = document.getElementById('authorBuku').value;
  const year = parseInt(document.getElementById('yearBuku').value);
  const isCompleted = document.getElementById('isCompletedbuku').checked;
  const id = generateId();
  const bookshelfObject = generateBookshelfObject(id, title, author, year, isCompleted);
  rakBuku.push(bookshelfObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function generateId() {
  return +new Date();
}
function generateBookshelfObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));

  const belumSelesaiDibaca = document.getElementById('belumSelesaiDibaca');
  belumSelesaiDibaca.innerHTML = '';
  const selesaiDibaca = document.getElementById('selesaiDibaca');
  selesaiDibaca.innerHTML = '';

  for (const bookshelfItem of rakBuku) {
    const rakBukuElemen = buatRakBuku(bookshelfItem);
    if (!bookshelfItem.isCompleted) belumSelesaiDibaca.append(rakBukuElemen);
    else selesaiDibaca.append(rakBukuElemen);
  }
});
function buatRakBuku(bookshelfObject) {
  const title = document.createElement('h4');
  title.innerText = bookshelfObject.title;
  const author = document.createElement('p');
  author.innerText = 'Penulis : ' + bookshelfObject.author;
  const year = document.createElement('p');
  year.innerText = 'Tahun : ' + bookshelfObject.year;

  const textContainer = document.createElement('div');
  textContainer.append(title, author, year);
  const container = document.createElement('div');
  container.classList.add('box');
  container.classList.add('button');
  container.append(textContainer);
  container.setAttribute('id', `rakBuku-${bookshelfObject.id}`);
  container.style.marginBottom = '20px';

  if (bookshelfObject.isCompleted) {
    const undoBtn = document.createElement('span');
    undoBtn.innerText = 'Belum Selesai Dibaca';
    undoBtn.classList.add('undo-button');
    undoBtn.addEventListener('click', function () {
      undoTaskBooks(bookshelfObject.id);
    });
    const trashButton = document.createElement('span');
    trashButton.innerText = 'Hapus';
    trashButton.classList.add('delete-button');
    trashButton.addEventListener('click', function () {
      removeTaskBooks(bookshelfObject.id);
    });
    container.append(undoBtn, trashButton);
  } else {
    const checkButton = document.createElement('span');
    checkButton.innerText = 'Selesai Dibaca';
    checkButton.classList.add('completed-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookshelfObject.id);
    });
    const trashButton = document.createElement('span');
    trashButton.innerText = 'Hapus';
    trashButton.classList.add('delete-button');
    trashButton.addEventListener('click', function () {
      removeTaskBooks(bookshelfObject.id);
    });
    container.append(checkButton, trashButton);
  }
  return container;
}
function addTaskToCompleted(bookshelfID) {
  const bookshelfTarget = findBooks(bookshelfID);
  if (bookshelfTarget == null) return;
  bookshelfTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeTaskBooks(bookshelfID) {
  const bookshelfTarget = deleteBook(bookshelfID);
  if (bookshelfTarget === -1) return;
  const modal = new bootstrap.Modal(document.getElementById('modalKonfirmasi'));
  modal.show();

  const confirmButton = document.getElementById('konfirmasiHapusButton');
  confirmButton.addEventListener('click', function () {
    rakBuku.splice(bookshelfTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    modal.hide();
  });
}
function undoTaskBooks(bookshelfID) {
  const bookshelfTarget = findBooks(bookshelfID);
  if (bookshelfTarget == null) return;
  bookshelfTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function deleteBook(bookshelfID) {
  for (const index in rakBuku) {
    if (rakBuku[index].id === bookshelfID) {
      return index;
    }
  }
  return -1;
}
function findBooks(bookshelfID) {
  for (const bookshelfItem of rakBuku) {
    if (bookshelfItem.id === bookshelfID) {
      return bookshelfItem;
    }
  }
  return null;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(rakBuku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'rak-buku-tersimpan';
const STORAGE_KEY = 'APLIKASI_RAK_BUKU';

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser Tidak Mendukung Local Storage/Penyimpanan Lokal');
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      rakBuku.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById('searchSubmit').addEventListener('click', function (e) {
  e.preventDefault();
  const cariBuku = document.getElementById('judulCariBuku').value.toLowerCase();
  const buku = document.querySelectorAll('h4');
  for (const data of buku) {
    const parentElement = data.parentElement.parentElement;
    if (data.innerText.toLowerCase().includes(cariBuku)) {
      parentElement.style.display = 'inline-block';
    } else {
      parentElement.style.display = 'none';
    }
  }
});
