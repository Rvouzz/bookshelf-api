const Hapi = require('@hapi/hapi');
const bookController = require('./controllers/bookController');
const db = require('./db');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: '127.0.0.1'
  });

  server.route([
    {
      method: 'POST',
      path: '/books',
      handler: bookController.createBook
    },
    {
      method: 'GET',
      path: '/books',
      handler: bookController.getAllBooks
    },
    {
      method: 'GET',
      path: '/books/{bookId}',
      handler: bookController.getBookById
    },
    {
      method: 'PUT',
      path: '/books/{bookId}',
      handler: bookController.updateBookById
    },
    {
      method: 'DELETE',
      path: '/books/{bookId}',
      handler: bookController.deleteBookById
    }
  ]);

  await db.getConnection();
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();