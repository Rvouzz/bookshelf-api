const db = require("../db");

const formatDate = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

async function createBook(request, h) {
  const { nanoid } = await import("nanoid");
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const id = nanoid(10);
  const now = new Date();
  const formattedDate = formatDate(now);

  try {
    const [results] = await db.query(
      `
      INSERT INTO books (id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `,
      [
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        false,
        formattedDate,
        formattedDate,
      ]
    );

    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  } catch (error) {
    console.error('Error creating book:', error);
    return h
      .response({
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
}

async function getAllBooks(request, h) {
  try {
    const [results] = await db.query("SELECT id, name, publisher FROM books");
    return h
      .response({
        status: "success",
        data: {
          books: results,
        },
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching all books:', error);
    return h
      .response({
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
}

async function getBookById(request, h) {
  const { bookId } = request.params;

  try {
    const [results] = await db.query("SELECT * FROM books WHERE id =?", [
      bookId,
    ]);

    if (results.length === 0) {
      return h
        .response({
          status: "fail",
          message: "Buku tidak ditemukan",
        })
        .code(404);
    }

    return h
      .response({
        status: "success",
        data: {
          book: results[0],
        },
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    return h
      .response({
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
}

async function updateBookById(request, h) {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  const now = new Date();
  const formattedDate = formatDate(now);

  try {
    const [results] = await db.query(
      `
        UPDATE books
        SET name = ?, year = ?, author = ?, summary = ?, publisher = ?, pageCount = ?, readPage = ?, reading = ?, updatedAt = ?
        WHERE id = ?
      `,
      [
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        formattedDate,
        bookId,
      ]
    );

    if (results.affectedRows === 0) {
      return h
        .response({
          status: "fail",
          message: "Gagal memperbarui buku. Id tidak ditemukan",
        })
        .code(404);
    }

    return h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
  } catch (error) {
    console.error('Error updating book:', error);
    return h
      .response({
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
}

async function deleteBookById(request, h) {
  const { bookId } = request.params;

  try {
    const [results] = await db.query("DELETE FROM books WHERE id = ?", [
      bookId,
    ]);

    if (results.affectedRows === 0) {
      return h
        .response({
          status: "fail",
          message: "Buku gagal dihapus. Id tidak ditemukan",
        })
        .code(404);
    }

    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  } catch (error) {
    console.error('Error deleting book:', error);
    return h
      .response({
        status: "error",
        message: "Internal Server Error",
      })
      .code(500);
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};