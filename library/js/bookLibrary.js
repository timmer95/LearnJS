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
    let id = crypto.randomUUID();
    let newBook = new Book(id, title, author, pages, read);
    myLibrary.push(newBook);
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
                                <div>
                                    <span>Status: ${selectedBook.readPart()}</span>
                                    <input type="checkbox">
                                </div>
                                <button class="warning-button" onclick="deleteBook()">Delete</button>
                            </div>`;
};

function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }

    return array;
}

function deleteBook() {
    let id = document.querySelector("#select-book-id").value;
    let selectedBook = myLibrary.find(book => book.id == id);
    myLibrary = removeItem(myLibrary, selectedBook);
    populateList(myLibrary);
    console.log(`Deleted book ${selectedBook.title}`)
}

const addBookButton = document.querySelector("#add-book");
addBookButton.addEventListener("click", function() {
    let title = document.querySelector("#add-title").value;
    let author = document.querySelector("#add-author").value;
    let pages = document.querySelector("#add-pages").value;
    addBookToLibrary(title, author, pages, false);
    populateList(myLibrary);
    console.log(`Added book ${title} by ${author} to library`);
})

const datalist = document.getElementById('all-book-ids');

function populateList(arr) {
    
    datalist.innerHTML = '';

    arr.forEach(book => {
        let bookId = book.id;
        var option = document.createElement("option");
        option.innerHTML = bookId;
        datalist.appendChild(option);
  });
}

window.onload = function() {
    populateList(myLibrary);
};
