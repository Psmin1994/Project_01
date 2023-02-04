import db from "../../../config/db.js";

const insertMovie = (data) => {
  var sql = `insert into movies (name, eName, img, openingDate, filmRate, genre, nation, runningTime, introContent, totalAudience, score) VALUES ('${data.name}', '${data.eName}', '${data.img}', '${data.openingDate}', '${data.filmRate}', '${data.genre}', '${data.nation}', '${data.runningTime}', '${data.introContent}', '${data.totalAudience}', ${data.score})`;

  db.query(sql, function (err, results, fields) {
    if (err) {
      console.error("error: " + err);
    }
    console.log(results);
  });

  db.end();
};

export default insertMovie;
