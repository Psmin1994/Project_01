import db from "../../../config/db.js";

var sql = `select * from topic`;

console.log("sql :" + sql);

db.query(sql, function (err, results, fields) {
  if (err) {
    console.error("error: " + err);
  }
  console.log(results);
});

db.end();
