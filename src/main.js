import './style.css';

// HTML elements
const newBookBtn = document.querySelector('.add-btn');
const newBookForm = document.getElementById('new-book-form');
const stars = document.querySelectorAll('.rating span');
const bookList = document.getElementById('book-list');

// Books class
let books = [];

// star rating

let selectedRating;
function starRating() {
  stars.forEach(star => {
    console.log('IT WORKS');
    star.addEventListener('click', function () {
      selectedRating = star.getAttribute('data-value');
      console.log(selectedRating);
      star.classList.add('selected');
    });
  });
}

//Local storage management
// get local storage
function getLocalStorage() {
  let data = JSON.parse(localStorage.getItem('books'));

  if (!data) return;

  books = data;

  books.forEach(book => {
    displayBooks(book);
  });
}
getLocalStorage();

// set local storage
function setLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
  // display books
  books.forEach(book => {
    displayBooks(book);
  });
}

class Book {
  constructor(title, author, bookStatus, rating, id) {
    ((this.title = title),
      (this.author = author),
      (this.bookStatus = bookStatus),
      (this.rating = rating),
      (this.id = id));
  }
}

// functions
// new book object
function newBook() {
  // get data from form
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const bookStatus = document.getElementById('status').value;
  const rating = selectedRating;
  // creates a random id
  const id = crypto.randomUUID();

  let book;

  // create new book object
  book = new Book(title, author, bookStatus, rating, id);

  // add book to books array
  books.push(book);

  // set local storage
  setLocalStorage();
}

// display book list
function displayBooks(book) {
  function ratingIntoStars() {
    switch (book.rating) {
      case '1':
        return '⭐️';
      case '2':
        return '⭐️⭐️';
      case '3':
        return '⭐️⭐️⭐️';
      case '4':
        return '⭐️⭐️⭐️⭐️';
      case '5':
        return '⭐️⭐️⭐️⭐️⭐️';
    }
  }
  let html = `
  <li class="book-card bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition" data-id="${book.id}">
    <h3 class="font-serif text-xl text-sage-800 mb-1">${book.title}</h3>
    <p class="text-sm text-sage-500 mb-3">${book.author}</p>
    <p class="text-xs font-bold uppercase tracking-widest text-clay-400 mb-1">
      Status: ${book.bookStatus[0].toUpperCase()}${book.bookStatus.slice(1)}
    </p>
    <p class="text-sm text-sage-600 mb-4">Rating: ${ratingIntoStars()}</p>
    <div class="actions flex gap-2">
      <button class="edit flex-1 bg-sage-100 hover:bg-sage-200 text-sage-700 text-xs font-bold uppercase tracking-widest rounded-lg py-2 transition focus:outline-none focus:ring-2 focus:ring-sage-400">
        Edit
      </button>
      <button class="delete flex-1 bg-clay-100 hover:bg-clay-200 text-clay-500 text-xs font-bold uppercase tracking-widest rounded-lg py-2 transition focus:outline-none focus:ring-2 focus:ring-clay-300">
        Delete
      </button>
    </div>
  </li>`;

  bookList.insertAdjacentHTML('beforeend', html);
}

// edit book
function editBook(e) {
  // get the book card element and id
  const bookCard = e.target.closest('.book-card');
  const bookID = bookCard.dataset.id;

  // find index and edit
  const bookIndex = books.findIndex(book => book.id === bookID);

  //open form again
  newBookForm.classList.remove('hidden');
  starRating();

  // get data from form
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const bookStatus = document.getElementById('status').value;
  const rating = selectedRating;
  // creates a random id
  const id = bookID;

  let book;

  // create new book object
  book = new Book(title, author, bookStatus, rating, id);

  // replace book object
  books.splice(bookIndex, 1, book);

  // display book on the list
  displayBooks(book);

  // set local storage
  setLocalStorage();
}

// delete book
function deleteBook(e) {
  // get the book card element and id
  const bookCard = e.target.closest('.book-card');
  const bookID = bookCard.dataset.id;

  // find index and remove from array
  const bookIndex = books.findIndex(book => book.id === bookID);

  books.splice(bookIndex, 1);

  // remove bookcard element
  bookCard.remove();

  // update local storage
  setLocalStorage();
}

// reset form
function formReset() {
  newBookForm.reset();
  selectedRating = 0;
  stars.forEach(s => s.classList.remove('selected'));
}

// event listeners
newBookBtn.addEventListener('click', function () {
  console.log('works');

  newBookForm.classList.remove('hidden');
  starRating();
});

newBookForm.addEventListener('submit', function (e) {
  e.preventDefault();
  // add book
  newBook();
  // reset form
  formReset();
  // remove form
  newBookForm.classList.add('hidden');
});

bookList.addEventListener('click', function (e) {
  if (!e.target.classList.contains('delete')) return;

  if (e.target.classList.contains('delete')) {
    deleteBook(e);
  }
});

bookList.addEventListener('click', function (e) {
  if (!e.target.classList.contains('edit')) return;

  if (e.target.classList.contains('edit')) {
    console.log('hola');

    editBook(e);
  }
});
