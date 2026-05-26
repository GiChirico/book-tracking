// HTML elements
const newBookBtn = document.querySelector('.add-btn');
const newBookForm = document.getElementById('new-book-form');
const stars = document.querySelectorAll('.rating span');
const bookList = document.getElementById('book-list');

// Books class
let books = [];
class Book {
  constructor(title, author, bookStatus, rating, coverURL, id) {
    ((this.title = title),
      (this.author = author),
      (this.bookStatus = bookStatus),
      (this.rating = rating),
      (this.coverURL = coverURL),
      (this.id = id));
  }
}

// star rating

let selectedRating;

function starRating(value) {
  selectedRating = value;
  stars.forEach(star => {
    const starValue = star.dataset.value;
    star.classList.toggle('selected', starValue <= selectedRating);
  });
}

//Local storage management
// get local storage
function getLocalStorage() {
  let data = JSON.parse(localStorage.getItem('books'));

  if (!data) return;

  books = data;

  console.log(books);

  renderBooks();
}
getLocalStorage();

// set local storage
function setLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
  // display books
  renderBooks();
}

// functions

// fetch cover url
async function fetchCoverURL(title, author) {
  try {
    const formattedTitle = title.toLowerCase().replaceAll(' ', '+');
    const formattedAuthor = author.toLowerCase().replaceAll(' ', '+');
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${formattedTitle}&author=${formattedAuthor}&limit=1`,
    );
    if (!response.ok) throw new Error('Failed to fetch cover image');

    const data = await response.json();
    if (!data.docs || data.docs.length === 0)
      throw new Error('No results found for the given title and author');

    const coverID = data.docs[0].cover_i;
    if (!coverID)
      throw new Error('No cover image found for the given title and author');

    const coverURL = `https://covers.openlibrary.org/b/id/${coverID}-S.jpg`;

    return coverURL;
  } catch (error) {
    console.error(`Error fetching cover URL: ${error.message}`);
    return null;
  }
}

// new book object
async function newBook() {
  // get data from form
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const bookStatus = document.getElementById('status').value;
  const rating = selectedRating;

  // creates a random id
  const id = crypto.randomUUID();

  // skeleton card
  const skeleton = `
    <li class="skeleton-card bg-parchment-100 border border-parchment-400 rounded-2xl p-5 flex gap-4" data-skeleton-id="${id}">
      <div class="w-16 h-24 rounded-lg shrink-0 bg-sage-100 animate-pulse"></div>
      <div class="flex flex-col flex-1 gap-3">
        <div class="h-6 bg-sage-100 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-sage-100 rounded animate-pulse w-1/2"></div>
        <div class="h-4 bg-sage-100 rounded animate-pulse w-1/4"></div>
      </div>
    </li>`;
  bookList.insertAdjacentHTML('beforeend', skeleton);

  // fetch cover url
  const coverURL = await fetchCoverURL(title, author);

  // remove skeleton
  document.querySelector(`[data-skeleton-id="${id}"]`).remove();

  // create new book object
  const book = new Book(title, author, bookStatus, rating, coverURL, id);

  // add book to books array
  books.push(book);

  // set local storage
  setLocalStorage();
}

// convert rating number into stars
function ratingIntoStars(rating) {
  const numberRating = +rating;
  let result = '';
  for (let i = 1; i <= 5; i++) {
    const color = i <= numberRating ? '#C38B74' : '#D9E2D3';
    result += `<span style="color: ${color}">★</span>`;
  }
  return result;
}

// create book card
function createBookCard(book) {
  const coverImg = book.coverURL
    ? `<img src="${book.coverURL}" alt="${book.title} cover" class="w-16 h-24 object-cover rounded-lg shrink-0">`
    : `<div class="w-16 h-24 rounded-lg shrink-0 bg-sage-100 border border-sage-300 flex items-center justify-center text-sage-400 font-display text-xl animate-pulse">
      ${book.title[0].toUpperCase()}
    </div>`;

  const html = `
  <li class="book-card bg-parchment-100 border border-parchment-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex gap-4" data-id="${book.id}">
    ${coverImg}
    <div class="flex flex-col flex-1">
      <h3 class="font-display text-2xl text-bark-700 mb-1">${book.title}</h3>
      <p class="italic text-bark-400 text-base mb-3">${book.author}</p>
      <p class="font-display text-base text-bark-300 mb-1">${book.bookStatus}</p>
      <p class="text-lg mb-4">${ratingIntoStars(book.rating)}</p>
      <div class="actions flex gap-2 mt-auto">
        <button class="edit font-display text-lg flex-1 bg-parchment-300 hover:bg-parchment-400 text-bark-600 rounded-lg py-2 transition focus:outline-none focus:ring-2 focus:ring-bark-400">edit</button>
        <button class="delete font-display text-lg flex-1 bg-terra-100 hover:bg-terra-200 text-terra-600 rounded-lg py-2 transition focus:outline-none focus:ring-2 focus:ring-terra-300">delete</button>
      </div>
    </div>
  </li>`;

  bookList.insertAdjacentHTML('beforeend', html);
}

// render books list
function renderBooks() {
  bookList.innerHTML = '';
  books.forEach(book => createBookCard(book));
}

// edit book
function editBook(e) {
  const bookCard = e.target.closest('.book-card');
  const bookID = bookCard.dataset.id;
  const bookIndex = books.findIndex(b => b.id === bookID);
  const book = books[bookIndex];

  // pre-fill the form
  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('status').value = book.bookStatus;
  starRating(book.rating);

  // remove the book
  books.splice(bookIndex, 1);
  bookCard.remove();

  // open the form
  newBookForm.classList.remove('hidden');
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
  starRating(0);
}

// event listeners
stars.forEach(star => {
  star.addEventListener('click', function () {
    starRating(star.dataset.value);
  });
});

newBookBtn.addEventListener('click', function () {
  console.log('works');

  newBookForm.classList.remove('hidden');
  starRating(0);
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
