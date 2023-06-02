const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
  return +new Date();
}

    
 

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  };
}


function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
  
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {


  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement('article');
  textContainer.classList.add('book_item', 'shadow');
  textContainer.append(textTitle, textAuthor, textYear);
  textContainer.setAttribute('id', `book-${bookObject.id}`);
  

  if (bookObject.isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('blue');
    undoButton.innerText='Belum Selesai';
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText='Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(undoButton, trashButton);
    textContainer.append(action);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('green');
    checkButton.innerText='Sudah Selesai';
    checkButton.addEventListener('click', function () {
        addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText='Hapus Buku';
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });


    const action = document.createElement('div');
    action.classList.add('action');
    action.append(checkButton, trashButton);
    textContainer.append(action);
  }

  return textContainer;
}

function addBook() {

    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
  
    var cbCompleted = document.getElementsByName('inputBookIsComplete');
    var isCompleted = false;
    for (var i = 0; i < cbCompleted.length; i++) {
        if (cbCompleted[i].checked) {
            isCompleted = true;
        }

    }

document.getElementById('inputBookTitle').value="";
document.getElementById('inputBookAuthor').value="";
document.getElementById('inputBookYear').value="";
document.getElementsByName('inputBookIsComplete').checked=false;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, isCompleted);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function addTaskToCompleted(bookId /* HTMLELement */) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  
  function removeTaskFromCompleted(bookId /* HTMLELement */) {
    let text ="Apakah anda yakin ingin menghapus buku?";
    if(confirm(text)==true){
        const bookTarget = findBookIndex(bookId);
    
        if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } 
  }
function getBookInputForm() {
    return {
        container: document.querySelector('#inputBook'),
        inputBookId: document.querySelector('#inputBookId'),
        inputTitle: document.querySelector('#inputBookTitle'),
        inputAuthor: document.querySelector('#inputBookAuthor'),
        inputYear: document.querySelector('#inputBookYear'),
        checkBoxIsComplete: document.querySelector('#inputBookIsComplete'),
        buttonSubmit: document.querySelector('#bookSubmit')

    }
}

const bookInputForm = getBookInputForm();

bookInputForm.checkBoxIsComplete.addEventListener('change', (e) => {
    const submitSpanText = bookInputForm.buttonSubmit.querySelector('span')
    if (e.currentTarget.checked) {
        submitSpanText.innerText = 'Sudah Selesai Dibaca'

    } else {
        submitSpanText.innerHTML = 'Belum Selesai Dibaca'
    }
})

  
  function undoTaskFromCompleted(bookId /* HTMLELement */) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  document.addEventListener('DOMContentLoaded', function () {
  
    const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');
  
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    const listCompleted = document.getElementById('completeBookshelfList');
  
    // clearing list item
    uncompletedBOOKList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isCompleted) {
        listCompleted.append(bookElement);
      } else {
        uncompletedBOOKList.append(bookElement);
      }
    }

  });
 
  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event){
    event.preventDefault();
    const searchBook = document
    .getElementById('searchBookTitle')
    .value.toLowerCase();
const bookList = document.querySelectorAll('.book_item > h3');
for (const book of bookList){
    if (book.innerText.toLowerCase().includes(searchBook)){
        book.parentElement.style.display ='block';
    } else {
        book.parentElement.style.display ='none';
    }
    }
    console.log(bookList);
});