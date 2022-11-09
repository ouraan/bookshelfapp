const form_add_container = document.getElementById("form-input");
const form_add = document.getElementById("form-add");
const form_update_container = document.getElementById("form-update");
const form_update = document.getElementById("form-change");
const form_search = document.getElementById("form-search");
const btn_close = document.getElementById("btn-close");
const btn_close_update = document.getElementById("btn-close-update");
const btn_add = document.getElementById("btn-add");
const check_input = document.getElementById("status-input");
const check_update = document.getElementById("status-update");

const updateTitle = document.getElementById("title-update");
const updateAuthor = document.getElementById("author-update");
const updateYear = document.getElementById("year-update");
const searchInput = document.getElementById("input-search");

const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'TODO_APPS';
const SAVED_EVENT = 'saved-book';

window.addEventListener("click", function(event){
    if(event.target == form_add_container){
        form_add_container.style.display = "none";
    }
});

window.addEventListener("click", function(event){
    if(event.target == form_update_container){
        form_update_container.style.display = "none";
    }
});

btn_add.addEventListener("click", function(){
    form_add_container.style.display = "block";
});

btn_close.addEventListener("click", function(){
    form_add_container.style.display = "none";
});

btn_close_update.addEventListener("click", function(){
    form_update_container.style.display = "none";
});

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert("Your browser does not support local storage");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function(){
    if(isStorageExist()){
        loadDataFromStorage();
    }
    const submitForm = form_add;
    submitForm.addEventListener("submit", function(){
        addBook();
    });
    const searchForm = form_search;
    searchForm.addEventListener("submit", function(){
        event.preventDefault();
        searchBook();
    });

});

document.addEventListener(RENDER_EVENT, function(){
    console.log(books);
});

document.addEventListener(RENDER_EVENT, function(){
    const unreadBooks = document.getElementById("unread-books");
    unreadBooks.innerHTML = "";

    const doneBooks = document.getElementById("done-books");
    doneBooks.innerHTML = "";

    for(const bookItem of books){
        const bookElement = uiBook(bookItem);
        if(!bookItem.isCompleted){
            unreadBooks.append(bookElement);
        }
        else{
            doneBooks.append(bookElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted){
    return{
        id,
        title,
        author,
        year,
        isCompleted,
    }
}

function addBook(){
    const valueTitle = document.getElementById("title-input").value;
    const valueAuthor = document.getElementById("author-input").value;
    const valueYear = document.getElementById("year-input").value;
    let valueStatus;
    const generateID = generateId();

    if(check_input.checked){
        valueStatus = false;
    }
    else{
        valueStatus = true;
    }
    bookObject = generateBookObject(generateID, valueTitle, valueAuthor, valueYear, valueStatus);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function uiBook(bookObject){
    // Text
    const textTitle = document.createElement("h2");
    textTitle.classList.add("item-title");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.classList.add("item-author");
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement("p");
    textYear.classList.add("item-year");
    textYear.innerText = bookObject.year;

    const textStatus = document.createElement("p");
    textStatus.classList.add("item-status");

    // Container
    const toolsContainer = document.createElement("div");
    toolsContainer.classList.add("item-tools");

    const equipContainer = document.createElement("div");
    equipContainer.classList.add("item-equip");

    const itemContainer = document.createElement("div");
    if(bookObject.isCompleted){
        textStatus.innerText = "Done";
        itemContainer.classList.add("item-list", "item-list-done");

        const btnEdit = document.createElement("button");
        btnEdit.classList.add("btn-edit");

        btnEdit.addEventListener("click", function(){
            showBook(bookObject.id);
            form_update_container.style.display = "block";
            const updateForm = form_update;
            updateForm.addEventListener("submit", function(){
                updateBook(bookObject.id);
            });
        });

        const btnTrash = document.createElement("button");
        btnTrash.classList.add("btn-remove");
        btnTrash.addEventListener("click", function(){
            removeBook(bookObject.id);
        });

        toolsContainer.append(btnEdit, btnTrash);
    }
    else{
        textStatus.innerText = "Unread";
        itemContainer.classList.add("item-list", "item-list-unread");

        const btnTrash = document.createElement("button");
        btnTrash.classList.add("btn-remove");

        const btnEdit = document.createElement("button");
        btnEdit.classList.add("btn-edit");

        btnEdit.addEventListener("click", function(){
            showBook(bookObject.id);
            form_update_container.style.display = "block";
            const updateForm = form_update;
            updateForm.addEventListener("submit", function(){
                updateBook(bookObject.id);
            });
        });

        btnTrash.addEventListener("click", function(){
            removeBook(bookObject.id);
        });
        
        toolsContainer.append(btnEdit, btnTrash);
    }

    // Arranging
    equipContainer.append(textStatus, toolsContainer);
    itemContainer.append(equipContainer, textTitle, textAuthor, textYear);

    itemContainer.setAttribute("id", `book-${bookObject.id}`);
    return itemContainer;
}

function findBookIndex(bookId){
    for(const index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function findBook(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeBook(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1){
        return;
    }
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    confirm('Are you sure you want to delete this book?');
}

function showBook(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null){
        return;
    }
    updateTitle.value = bookTarget.title;    
    updateAuthor.value = bookTarget.author;    
    updateYear.value = bookTarget.year;
    if(bookTarget.isCompleted){
        check_update.checked = false;
    }
    else{
        check_update.checked = true;
    }
}

function updateBook(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null){
        return;
    }
    bookTarget.title = updateTitle.value;
    bookTarget.author = updateAuthor.value;
    bookTarget.year = updateYear.value;
    if(check_update.checked){
        bookTarget.isCompleted = false;
    }
    else{
        bookTarget.isCompleted = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const seralizeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(seralizeData);
    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook(){
    const searchInputValue = searchInput.value.toString(); 
    const unreadBooks = document.getElementById("unread-books");
    unreadBooks.innerHTML = "";

    const doneBooks = document.getElementById("done-books");
    doneBooks.innerHTML = "";

    const keyword = searchInputValue.toUpperCase();
    for(const bookItem of books){
        const bookElement = uiBook(bookItem);
        if(bookItem.title.toUpperCase().indexOf(keyword) > -1){
            if(!bookItem.isCompleted){
                unreadBooks.append(bookElement);
            }
            else{
                doneBooks.append(bookElement);
            }
            console.log(bookItem);
        }
    }
};

