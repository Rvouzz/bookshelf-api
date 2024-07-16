const mysql = require("mysql2");

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: "pebz",
  password: "Feb@0602",
  database: "bookshelf_db"
});

module.exports = pool.promise();