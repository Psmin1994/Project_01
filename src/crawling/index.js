import getList from "./getList.js";
import getMovie from "./getMovie.js";
import getPerson from "./getPerson.js";
import getReview from "./getReview.js";

var crawl = async () => {
  try {
    var href_List = await getList();

    var index = 1;
    for (let href of href_List) {
      console.log(index++ + " / " + href_List.length);
      var movies = await getMovie(href);

      var persons = await getPerson(href);

      var reviews = await getReview(href);
    }
  } catch (e) {
    console.error(e);
  }
};

crawl();
