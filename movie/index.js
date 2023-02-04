import puppeteer from "puppeteer";
import getList from "./getList.js";
import getActor from "./getActor.js";
import getReviews from "./getReviews.js";
import getMovie from "./getMovie.js";

var crawl = async () => {
  try {
    var href_List = getList();

    const href = href_List[1];

    var movie = getMovie(href);

    var actor = getActor(href);

    var reviews = getReviews(href);
  } catch (e) {
    console.error(e);
  }
};

crawl();
