import getList from "./getList.js";
import getMovie from "./getMovie.js";
import getPerson from "./getPerson.js";
import getReview from "./getReview.js";

var crawl = async () => {
  try {
    var href_List = await getList();

    await getMovie(href_List);

    await getPerson(href_List);

    await getReview(href_List);

    return console.log("Insert Init Table Finish");
  } catch (e) {
    console.error(e);
  }
};

crawl();
