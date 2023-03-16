var inStockFilterFlag = false;
var expiredDateFlag = false;

function openAddDialog(){
    document.getElementById('add').showModal();
}

function openConfirmDialog(){
    document.getElementById('confirm').showModal();
}

function closeDialog(element){
    element.closest('dialog').close();
}

function deleteBook(id) {
    fetch('/delete/'+id, {method: 'DELETE'}).then(() => location.href = "/");
}

function returnBook(id) {
    fetch('/return/'+id, {method: 'POST'}).then(() => location.href = "/");
}

function openInfo(id) {
    fetch('/book/'+id).then((res) => res.json()).then((book) => {
        document.getElementById('author_edit').value = book.author;
        document.getElementById('name_edit').value = book.name;
        document.getElementById('date_release_edit').value = book.dateRelease;
        document.getElementById('editform').setAttribute('action', '/edit/' + book.id);
        document.getElementById('takeform').setAttribute('action', '/take/' + book.id);
        document.getElementById('returnButton').setAttribute('onClick', 'returnBook('+book.id+')')
        document.getElementById('confirmButton').setAttribute('onClick', 'deleteBook('+book.id+')')
        if (book.inStock == true){
            document.getElementById('ifBookNotInStock').setAttribute('hidden','');
            document.getElementById('ifBookInStock').removeAttribute('hidden');
        } else {
            document.getElementById('ifBookInStock').setAttribute('hidden','');
            document.getElementById('ifBookNotInStock').removeAttribute('hidden');
            document.getElementById('spanTakenby').innerHTML = " " + book.takenBy;
            document.getElementById('spanTakenby').setAttribute('onClick', 'openReaderInfo(' + "'"+ book.takenBy+ "'" + ')');
            document.getElementById('spanReturnDate').innerHTML = " на срок до " + book.dateReturn;
        }
    });
    document.getElementById('info').showModal();
}

function openReaderInfo(takenBy){
    fetch('/reader/'+takenBy).then((res) => res.json()).then(arr => {
        document.getElementById('takenBy').innerHTML = " " + takenBy;
        let table = document.getElementById('readerTableBody');
        table.innerHTML = '';
        arr.forEach((book) => {
            let tr = table.insertRow();
            let author = tr.insertCell();
            let name = tr.insertCell();
            let dateRelease = tr.insertCell();
            let dateReturn = tr.insertCell();
            name.innerText = book.name;
            author.innerText = book.author;
            dateRelease.innerText = book.dateRelease;
            dateReturn.innerText = (book.dateReturn === undefined ? "" : book.dateReturn);
        });
    });
    document.getElementById('readerList').showModal();
}

function toggleInStockFilter(button){
    inStockFilterFlag = !inStockFilterFlag;
    if (inStockFilterFlag == true)
        button.setAttribute("class", "toggled_button");
    else
        button.removeAttribute("class");
    applyFilter();
}

function toggleExpiredDateFilter(button){
    expiredDateFlag = !expiredDateFlag;
    if (expiredDateFlag == true)
        button.setAttribute("class", "toggled_button");
    else
        button.removeAttribute("class");
    applyFilter();
}

function applyFilter(){
    fetch( '/filter',
        {
            method: 'POST',
            body: new URLSearchParams({inStockFilterFlag, expiredDateFlag})
        }
        ).then(res => res.json()).then(arr => {
            let table = document.getElementById('tablebody');
            table.innerHTML = '';
            arr.forEach((book) => {
                let tr = table.insertRow();
                tr.setAttribute('class', 'tr_tbody');
                tr.addEventListener('click', () => openInfo(book.id));
                let author = tr.insertCell();
                let name = tr.insertCell();
                let dateRelease = tr.insertCell();
                let inStock = tr.insertCell();
                let dateReturn = tr.insertCell();
                name.innerText = book.name;
                author.innerText = book.author;
                dateRelease.innerText = book.dateRelease;
                dateReturn.innerText = (book.dateReturn === undefined ? "" : book.dateReturn);
                inStock.innerHTML = '<i class="fa-solid ' + (book.inStock === true ? 'fa-check' : 'fa-xmark') + '"></i>';
            });
            }
        ); 
}