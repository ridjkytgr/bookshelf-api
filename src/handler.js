const books = require('./books');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku, Mohon isi nama buku',
        }).code(400);
    } else if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    } 

    books.push(newBook);

    if (books.filter((book) => book.id === id).length == 0) { // Generic error.
        return h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        }).code(500);
    }

    console.log(newBook);
    return h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
            bookId: id,
        }
    }).code(201);
};

const getAllBookHandler = (request, h) => ({
    status: 'success',
    data: {
        books,
    },
});


module.exports = { addBookHandler, getAllBookHandler };