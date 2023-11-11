/**
 * {
  id: 3657848524,
  title: 'Harry Potter and the Philosopher\'s Stone',
  author: 'J.K Rowling',
  year: 1997,
  isComplete: false,
}
 */

// LocalStorage and Custom Event Variable
const RENDER_EVENT = "renderBook";
const STORAGE_KEY = "books";
const books = [];

// Initial Variable DOM
const closeBtn = document.querySelector(".close-buton");
const createBook = document.querySelector(".submit-create-book");
const modalBtn = document.querySelector(".create-book-btn");
const modalContainer = document.querySelector(".container-create-book");
const formCreateBook = document.querySelector(".create-form");
const formSearchBook = document.querySelector(".search-form");
const containerBooks = document.querySelector(".container-books");
const containerCompleteBooks = document.querySelector(
  ".container-complete-books"
);

// Input Varible
const titleBook = document.getElementById("title");
const authorBook = document.getElementById("author");
const yearBook = document.getElementById("year");
const finishedBook = document.getElementById("done-read");

modalBtn.addEventListener("click", () => {
  titleBook.value = "";
  authorBook.value = "";
  yearBook.value = "";
  finishedBook.checked = false;
  modalContainer.classList.add("active");
  formCreateBook.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  modalContainer.classList.remove("active");
  formCreateBook.classList.remove("active");
});

// Function utility
const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

const findBookIndex = (todoId) => {
  for (const index in books) {
    if (books[index].id === todoId) {
      return index;
    }
  }
  return -1;
};

// Function to create a new button element
function createButton(className, imgSrc, imgAlt, buttonText) {
  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("btn", className);

  // Create image element
  const imgElement = document.createElement("img");
  imgElement.src = imgSrc;
  imgElement.alt = imgAlt;

  // Create paragraph element
  const pElement = document.createElement("p");
  pElement.textContent = buttonText;

  // Append image and paragraph to button container
  buttonContainer.appendChild(imgElement);
  buttonContainer.appendChild(pElement);

  return buttonContainer;
}

// Function LocalStorage Functionality
const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

// Main of Functionality CRUD
function makeBook(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");

  const titleBook = document.createElement("div");
  titleBook.classList.add("title-book");
  titleBook.innerText = `${title}`;

  const authorBook = document.createElement("div");
  authorBook.classList.add("author-book");
  authorBook.innerText = `Author: ${author}`;

  const yearBook = document.createElement("div");
  yearBook.classList.add("year-book");
  yearBook.innerText = `Year: ${year}`;

  const btnField = document.createElement("div");
  btnField.classList.add("btn-field");

  cardContainer.append(titleBook, authorBook, yearBook);
  cardContainer.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const newFinishButton = createButton(
      "btn-finish",
      "./src/assets/repeat.svg",
      "done-icon",
      "Unfinished Read"
    );
    const newDeleteButton = createButton(
      "btn-delete",
      "./src/assets/delete.svg",
      "delete-icon",
      "Delete Book"
    );

    newFinishButton.addEventListener("click", () => {
      undoBookFromCompleted(id);
    });

    newDeleteButton.addEventListener("click", () => {
      removeBookFromCompleted(id);
    });

    btnField.append(newFinishButton, newDeleteButton);

    cardContainer.append(btnField);
  } else {
    const newFinishButton = createButton(
      "btn-finish",
      "./src/assets/done.svg",
      "done-icon",
      "Finished Read"
    );
    const newDeleteButton = createButton(
      "btn-delete",
      "./src/assets/delete.svg",
      "delete-icon",
      "Delete Book"
    );

    newFinishButton.addEventListener("click", () => {
      addBookToCompleted(id);
    });

    newDeleteButton.addEventListener("click", () => {
      removeBookFromCompleted(id);
    });

    btnField.append(newFinishButton, newDeleteButton);

    cardContainer.append(btnField);
  }
  return cardContainer;
}

const addBook = () => {
  const title = titleBook.value;
  const author = authorBook.value;
  const year = yearBook.value;
  const finish = finishedBook.checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    finish
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

const addBookToCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

const undoBookFromCompleted = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

const removeBookFromCompleted = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
};

// Search Functionality
formSearchBook.addEventListener("submit", (e) => {
  e.preventDefault();
});

// When DOM Load
document.addEventListener("DOMContentLoaded", () => {
  formCreateBook.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    modalContainer.classList.remove("active");
    formCreateBook.classList.remove("active");
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Custom Event
document.addEventListener(RENDER_EVENT, function () {
  // clearing list item
  containerBooks.innerHTML = "";
  containerCompleteBooks.innerHTML = "";

  for (const booksItem of books) {
    const booksElement = makeBook(booksItem);
    if (booksItem.isCompleted) {
      containerCompleteBooks.append(booksElement);
    } else {
      containerBooks.append(booksElement);
    }
  }
});
