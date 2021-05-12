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

    return h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
            id: id,
        }
    }).code(201);
};

const getAllBookHandler = (request, h) => {
    return h.response({
    status: 'success',
    data: {
        books,
    },
    }).code(200)
};

const getBookByIdHandler = (request, h) => {
    // Mengambil id dari params
    const { id } = request.params;

    // Jika buku ditemukan
    if (books.filter((b) => b.id === id).length > 0) {
        // Mengambil buku yang memiliki id tersebut
        const book = books.filter((b) => b.id === id)[0];
        return h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    const book = books.filter((b) => b.id === id)[0]

    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku, Mohon isi nama buku',
        }).code(400);
    } else if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    } else if (readPage > book.pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    } 

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
    };
    
    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);
    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
}

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };