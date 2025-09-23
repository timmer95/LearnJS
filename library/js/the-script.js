

function Book(id, title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = id,
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.read = read,
    this.readPart = function() {
        this.read ? readPart = "already read" : readPart = "not read yet";
        return readPart
    }
    this.info = function() {
        let readPart;
        this.read ? readPart = "already read" : readPart = "not read yet";
        return this.title, this.author, this.pages, readPart
    }
}

function addBookToLibrary(title, author, pages, read) {
    let id = crypto.randomUUID()
    let newBook = new Book(id, title, author, pages, read)
    myLibrary.push(newBook)
    return id;
}

let myLibrary = [
    new Book(1, "surrounded by idiots", "thomas erikson", 154, false ),
    new Book(2, "Fuzzy", "Hanna Bervoets", 296, true),
    new Book(3, "Eenzaam Avontuur", "Anna Blaman", 411, true)
];

function renderBook(id) {
    let selectedBook = myLibrary.find(book => book.id == id)
    var displayBook = document.querySelector("#display-book");
    displayBook.innerHTML = `<div class="display">
                                <div class="title">${selectedBook.title}</div>
                                <div class="author">${selectedBook.author}</div>
                                <span>Pages: ${selectedBook.pages}</span>
                                <span>Status: ${selectedBook.readPart()}</span>
                            </div>`;
};

const addBookButton = document.querySelector("#add-book");
addBookButton.addEventListener("click", function() {
    let title = document.querySelector("#add-title").value;
    let author = document.querySelector("#add-author").value;
    let pages = document.querySelector("#add-pages").value;
    let id = addBookToLibrary(title, author, pages, false);
    let newOption = document.createElement("option");
    newOption.innerHTML = id;
    datalist.appendChild(newOption);
    console.log(`Added book ${title} by ${author} to library`);
})

// This is the datalist
const datalist = document.getElementById('all-book-ids');

function populateList(arr) {
  arr.forEach(book => {
    let bookId = book.id;
    var option = document.createElement("option");
    option.innerHTML = bookId;
    datalist.appendChild(option);
  });
}


populateList(myLibrary);