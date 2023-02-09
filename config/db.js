import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost" || process.env.DB_HOST,
  user: "root" || process.env.DB_USER,
  password: "java1994" || process.env.DB_PASSWORD,
  database: "test" || process.env.DB_DATABASE,
});

db.connect();

export default db;
