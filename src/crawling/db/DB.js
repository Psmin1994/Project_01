import db from "../../../config/db.js";

class DB {
  static async insertMovie(dataList) {
    const newPromise = (sql, sqlParams) => {
      return new Promise((resolve, reject) => {
        db.query(sql, sqlParams, (err, results) => {
          if (err) reject(`${err}`);
          else resolve("query success");
        });
      });
    };

    const promises = [];

    const sql =
      "insert ignore into movies (name, eName, img, openingDate, filmRate, genre, nation, runningTime, introContent, totalAudience, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

    for (let data of dataList) {
      const sqlParams = [
        data.name,
        data.eName,
        data.img,
        data.openingDate,
        data.filmRate,
        data.genre,
        data.nation,
        data.runningTime,
        data.introContent,
        data.totalAudience,
        data.score,
      ];

      const promise = await newPromise(sql, sqlParams);

      promises.push(promise);
    }

    Promise.allSettled(promises)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  static async insertActor(dataList) {
    const newPromise = (sql, sqlParams) => {
      return new Promise((resolve, reject) => {
        db.query(sql, sqlParams, (err, results) => {
          if (err) reject(`${err}`);
          else resolve("query success");
        });
      });
    };

    const promises = [];

    const sql1 = "insert ignore into actors (name, img) values (?, ?);";
    const sql2 = "insert ignore into movierole (role, roleName, movies_name, actors_name) values (?, ?, ?, ?);";

    for (let data of dataList) {
      const sqlParams1 = [data.name, data.img];
      const sqlParams2 = [data.role, data.roleName, data.movies_name, data.name];

      const promise1 = await newPromise(sql1, sqlParams1);
      const promise2 = await newPromise(sql2, sqlParams2);

      promises.push(promise1);
      promises.push(promise2);
    }

    Promise.allSettled(promises)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  static async insertDirector(dataList) {
    const newPromise = (sql, sqlParams) => {
      return new Promise((resolve, reject) => {
        db.query(sql, sqlParams, (err, results) => {
          if (err) reject(`${err}`);
          else resolve("query success");
        });
      });
    };

    const promises = [];

    const sql1 = "insert ignore into directors (name, img) values (?, ?);";
    const sql2 = "insert ignore into movierole (role, movies_name, directors_name) values (?, ?, ?);";

    for (let data of dataList) {
      const sqlParams1 = [data.name, data.img];
      const sqlParams2 = [data.role, data.movies_name, data.name];

      const promise1 = await newPromise(sql1, sqlParams1);
      const promise2 = await newPromise(sql2, sqlParams2);

      promises.push(promise1);
      promises.push(promise2);
    }

    Promise.allSettled(promises)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  static async insertReview(dataList) {
    const newPromise = (sql, sqlParams) => {
      return new Promise((resolve, reject) => {
        db.query(sql, sqlParams, (err, results) => {
          if (err) reject(`${err}`);
          else resolve("query success");
        });
      });
    };

    const promises = [];

    const sql = "insert ignore into reviews (userid, comment, date, score, movies_name) VALUES (?, ?, ?, ?, ?);";

    for (let data of dataList) {
      const sqlParams = [data.user, data.comment, data.date, data.score, data.movies_name];

      const promise = await newPromise(sql, sqlParams);

      promises.push(promise);
    }

    Promise.allSettled(promises)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }
}

export default DB;
