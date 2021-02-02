const libraryList = document.getElementById('library');
const addButton = document.getElementById('addBook');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('close');
const formTitle = document.getElementById('formTitle');
const title = document.getElementById('title');
const author = document.getElementById('author');
const bookLength = document.getElementById('pages');
const readProperty = document.getElementById('read');
const submit = document.getElementById('submit');
const edit = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const inputs = document.querySelectorAll('input');

/* ------------------------ OBJECT ------------------------ */
// Book object constructor
function Book(title, author, pages,read) {
    this.title = title,
    this.author = author,
    this.length = pages,
    this.read = read,
    this.index
}

Book.prototype.info = function(){
    let info = [`${this.title}`, `by ${this.author}`, `${this.length} pages`, `${this.read ? 'read' : 'not read yet'}`];
    return info
}

// books already in library
let hobbit = new Book('The Hobbit', 'J.R.R Tolkien', 298, false);
let secondBook = new Book('a title', 'an author', 28, true);
let myLibrary = [hobbit, secondBook];
for (let i = 0; i < myLibrary.length; i++) {
    myLibrary[i].index = i;
}

/* ------------------------ FORMS ------------------------ */
// hide / show form and buttons
function showForm(action) {
    overlay.classList.remove('hidden');
    if (action === 'edit') {
        submit.classList.add('hidden');
        edit.classList.remove('hidden');
        deleteButton.classList.remove('hidden');
        formTitle.textContent = 'Update book infos';
    } else {
        submit.classList.remove('hidden');
        edit.classList.add('hidden');
        deleteButton.classList.add('hidden');
        formTitle.textContent = 'New book';
    }
    resetForm()
}

// close form overlay
function closeOverlay() {
    overlay.classList.add("hidden");
    resetForm();
}

// reset form's inputs
function resetForm() {
    inputs.forEach(input => {
        input.value = '';
        input.checked = false;
        if (input.previousElementSibling.children[0]) {
            input.previousElementSibling.children[0].remove();
            input.classList.remove('error');
        }
    });
}

// call edit book form
function prefillEditForm(tg) {
    let i = tg.attributes["data-index"].value;
    showForm('edit')
    inputs[0].value = myLibrary[i].title;
    inputs[1].value = myLibrary[i].author;
    inputs[2].value = myLibrary[i].length;
    inputs[3].checked = myLibrary[i].read;
    inputs[4].value = myLibrary[i].index;
}

// check form validity before submitting
function validateForm() {
    if (title.value && author.value && bookLength.value > 0) {
        return true
    } else {
        if (!title.value && !title.previousElementSibling.children[0]) {
            createErrorMessage(title)
        }
        if (!author.value && !author.previousElementSibling.children[0]) { 
            createErrorMessage(author)
        }
        if ((!bookLength.value || bookLength.value < 1) && !bookLength.previousElementSibling.children[0]) {
            createErrorMessage(bookLength)
        }
        return false
    }
}

// real time validity input check
function checkFormInput(input) {
    let key = input.key;
    let tg = input.target;
    
    if ((tg.name === 'pages' && tg.valueAsNumber < 1) || (!tg.value && key !== 'Tab' && key !== 'Shift')) {
        if (!tg.previousElementSibling.children[0]) {
            createErrorMessage(tg)
        }
    } else if (tg.value) {
        if (tg.previousElementSibling.children[0]) {
            tg.previousElementSibling.children[0].remove();
            tg.classList.remove('error');
        }
    } 
}

// error message in case form is invalid
function createErrorMessage(input) {
    let errorMessage = document.createElement('div');
    errorMessage.classList.add('errorMessage');
    switch (input.name) {
        case 'title':
            errorMessage.textContent = 'Please enter a title';
            break;
        case 'author':
            errorMessage.textContent = 'Please enter an author';
            break;
        case 'pages':
            errorMessage.textContent = 'Please enter a valid length (number superior to 0)';
            break;
            
        default:
            break;
    }
    input.classList.add('error');
    input.previousElementSibling.appendChild(errorMessage);
}

/* ------------------------ LIBRARY PRINT ------------------------ */

// print all library
function printLibrary(){
    checkExistingBookInList();

    for (let book of myLibrary) {
        let card = document.createElement('div');    
        card.setAttribute('data-index', myLibrary.indexOf(book));
        card.classList.add('bookCard');

        let bookTitle = document.createElement('h2');
        bookTitle.classList.add('bookTitle');
        bookTitle.textContent = book.info()[0];
        card.appendChild(bookTitle);

        let bookAuthor = document.createElement('p');
        bookAuthor.classList.add('bookAuthor');
        bookAuthor.textContent = book.info()[1];
        card.appendChild(bookAuthor);

        let bookPages = document.createElement('p');
        bookPages.classList.add('bookPages');
        bookPages.textContent = book.info()[2];
        card.appendChild(bookPages);

        let bookStatus = document.createElement('p');
        bookStatus.classList.add('bookStatus');
        if(book.read) {
            bookStatus.classList.add('read');
        }
        bookStatus.textContent = book.info()[3];
        card.appendChild(bookStatus);
        
        libraryList.appendChild(card);
    }
}

//reset library list before printing all
function checkExistingBookInList() {
    let bookCards = document.querySelectorAll('div.bookCard');
    if (bookCards.length !== 0) {
        bookCards.forEach(card => {
            libraryList.removeChild(card);
        }); 
    }
}

/* ------------------------ BOOK CREATION ------------------------ */

//add in library and print
function addBookToLibrary () {
    if (validateForm()) {
        let aNewBook = new Book(title.value, author.value, bookLength.value, readProperty.checked);
        aNewBook.index = myLibrary.length;
        myLibrary.push(aNewBook);
        closeOverlay();
        printLibrary();
    } 
}

/* ------------------------ LIBRARY & BOOK UPDATE ------------------------ */

// change reading status
function toggleReadStatus(tg) { 
    tg.classList.toggle("read");
    let i = tg.parentNode.attributes["data-index"].value;
    myLibrary[i].read ? myLibrary[i].read = false : myLibrary[i].read = true;
    myLibrary[i].read ? tg.textContent = 'read' : tg.textContent = 'not read yet'
}

// edit library array and print editted library
function editBook() { 
    if (validateForm()) {  
        myLibrary[index.value].title = title.value;
        myLibrary[index.value].author = author.value;
        myLibrary[index.value].length = bookLength.value;
        myLibrary[index.value].read = readProperty.checked;
        closeOverlay();
        printLibrary();
    }
}

// delete book from array
function deleteBook () {
    myLibrary.splice(index.value, 1);
    //reindex all books of library!
    for (let i = 0; i < myLibrary.length; i++) {
        myLibrary[i].index = i;
    }
    closeOverlay();
    printLibrary();
}

/* ------------------------ Dispatch & function calls ------------------------ */

// check where the click happened and redirect to the right action
function checkClickTarget(e) {
    if (e.target.className.includes("bookStatus")) { 
        toggleReadStatus(e.target)
    } else if (e.target.className.includes("bookCard")) { 
        prefillEditForm(e.target)
    } else if (e.target.parentNode.className.includes("bookCard")) { 
        prefillEditForm(e.target.parentNode)
    } 
}

// function calls
document.onload = printLibrary();
libraryList.addEventListener('click', checkClickTarget);
addButton.addEventListener('click', showForm);
inputs.forEach(input => { input.addEventListener('keyup', checkFormInput) });
submit.addEventListener('click', addBookToLibrary);
edit.addEventListener('click', editBook);
deleteButton.addEventListener('click', deleteBook);
closeButton.addEventListener('click', closeOverlay);
document.addEventListener('keyup', (e) => {if (e.key === 'Escape') {closeOverlay()}})