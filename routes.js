const express = require("express");
const router = express.Router();
const fs = require('fs');

router.get("/", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    res.render('index', { bookTable: LibraryTable});
});

router.get("/book/:id", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    LibraryTable.forEach((book) => {
        if (book.id == (+req.params.id)) res.json(book);
    });
});

router.get("/reader/:takenBy", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    takenBooks = [];
    LibraryTable.forEach((book) => {
        if (book.takenBy == req.params.takenBy) takenBooks.push(book);
    });
    res.json(takenBooks);
});

router.post("/add", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    req.body.inStock = true;
    if (LibraryTable.length != 0) 
        req.body.id = LibraryTable[LibraryTable.length-1].id + 1;
    else 
        req.body.id = 0;
    LibraryTable.push(req.body);
    fs.writeFileSync('./bookTable.json', JSON.stringify(LibraryTable));
    res.redirect('/');
});

router.post("/take/:id", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    LibraryTable.forEach((book, i, LibraryTable) => {
        if (book.id == (+req.params.id)) {
            LibraryTable[i].inStock = false;
            LibraryTable[i].takenBy = req.body.nameTaker;
            LibraryTable[i].dateReturn = req.body.dateReturn;
        }
    });
    fs.writeFileSync('./bookTable.json', JSON.stringify(LibraryTable));
    res.redirect('/');
});

router.post("/edit/:id", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    LibraryTable.forEach((book, i, LibraryTable) => {
        if (book.id == (+req.params.id)) {
            LibraryTable[i].name = req.body.name;
            LibraryTable[i].author = req.body.author;
            LibraryTable[i].dateRelease = req.body.dateRelease;
        }
    });
    fs.writeFileSync('./bookTable.json', JSON.stringify(LibraryTable));
    res.redirect('/');
});

router.post("/return/:id", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    LibraryTable.forEach((book, i, LibraryTable) => {
        if (book.id == (+req.params.id)) {
            LibraryTable[i].inStock = true;
            LibraryTable[i].takenBy = null;
            LibraryTable[i].dateReturn = null;
        }
    });
    fs.writeFileSync('./bookTable.json', JSON.stringify(LibraryTable));
    res.redirect('/');
});

router.post("/filter", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    FilteredLibraryTable = [];
    let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	if (day < 10) day = '0' + day;
	if (month < 10) month = '0' + month;
	curDate = year + '-' + month + '-' + day;

    for (book of LibraryTable) {
        if (req.body.inStockFilterFlag == 'true'){
            if (book.inStock == false) continue; 
        }
        if (req.body.expiredDateFlag == 'true'){
            if (book.dateReturn == null || book.dateReturn > curDate) continue;
        }
        FilteredLibraryTable.push(book);
    }
    res.json(FilteredLibraryTable);
});

router.delete("/delete/:id", (req, res)=>{
    LibraryTable = JSON.parse(fs.readFileSync('./bookTable.json'));
    LibraryTable.forEach((book, i, LibraryTable) => {
        if (book.id == (+req.params.id)) {
            LibraryTable.splice(i, 1);
        }
    });
    fs.writeFileSync('./bookTable.json', JSON.stringify(LibraryTable));
    res.end();
});

module.exports = router;