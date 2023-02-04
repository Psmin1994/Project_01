import puppeteer from "puppeteer";
import getImgUrl from "./getImgUrl.js";
import insertMovie from "./db/insertMovie.js";

var getMovie = async (href) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    // 새로운 페이지를 연다.
    const page = await browser.newPage();

    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768,
    });

    await page.goto(href);

    const data = {};
    await page.waitForSelector(
      "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(2) > a"
    );

    await page.click(
      "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(2) > a"
    );

    await page.waitForSelector("#main_pack > div._au_movie_content_wrap");

    const selector = await page.$("#main_pack > div._au_movie_content_wrap");

    data.name = await selector.$eval(
      "div.cm_top_wrap > div.title_area > h2 > span.area_text_title > strong > a",
      (element) => {
        return element.textContent;
      }
    );

    data.eName = await selector.$eval("div.cm_top_wrap > div.title_area > div > span:nth-child(3)", (element) => {
      return element.textContent;
    });

    const img = await selector.$eval(
      " div.cm_content_wrap > div.cm_content_area > div > div.detail_info > a > img",
      (element) => {
        return { url: element.src, name: Math.random().toString(36).substring(2, 12) };
      }
    );

    data.img = await getImgUrl(img, "movies/poster");

    data.openingDate = await selector.$eval(
      "div.cm_content_wrap > div.cm_content_area > div > div.detail_info > dl > div:nth-child(1) > dd",
      (element) => {
        return element.textContent.slice(0, -1);
      }
    );

    data.filmRate = await selector.$eval(
      "div.cm_content_wrap > div.cm_content_area > div > div.detail_info > dl > div:nth-child(2) > dd",
      (element) => {
        return element.textContent;
      }
    );

    var tmp = await selector.$eval(
      "div.cm_content_wrap > div.cm_content_area > div > div.detail_info > dl > div:nth-child(3) > dd",
      (element) => {
        const string = element.textContent;
        var tmp = string.split(", ");

        return tmp;
      }
    );

    data.genre = JSON.stringify(tmp);

    data.nation = await selector.$eval(
      "div.cm_content_wrap > div.cm_content_area > div > div.detail_info > dl > div:nth-child(4) > dd",
      (element) => {
        return element.textContent;
      }
    );

    data.runningTime = await selector.$eval(
      "div.cm_content_wrap > div.cm_content_area > div > div.detail_info > dl > div:nth-child(5) > dd",
      (element) => {
        return element.textContent;
      }
    );

    data.introContent = await selector.$eval(
      "div.cm_content_wrap > div.cm_content_area > div > div.intro_box._content > p",
      (element) => {
        return element.textContent;
      }
    );

    // 평점, 관객 수 정보 담겨져있는 <div> 존재하는지 체크
    let testStr = await selector.$$eval("div.cm_content_wrap > div", (element) => {
      var attr = element[2].attributes[0].value.split(" ");
      return attr;
    });

    var tmp = false;

    for (let test of testStr) {
      if (test.includes("graph_rank")) {
        tmp = true;
      }
    }

    if (tmp) {
      data.totalAudience = await selector.$eval(
        "div.cm_content_wrap > div.cm_content_area > div > div.lego_rating_star > ul > li:nth-child(3) > div.area_content > span",
        (element) => {
          return element.textContent + "만 명";
        }
      );

      data.score = await selector.$eval(
        "div.cm_content_wrap > div.cm_content_area._cm_content_area_graph_rank > div > div.lego_rating_star > ul > li:nth-child(2) > a > div.area_content > span.this_text_bold",
        (element) => {
          return element.textContent * 1;
        }
      );
    }

    await insertMovie(data);

    // 브라우저를 종료한다.
    await browser.close();
  } catch (err) {
    console.log(err);
  }
};

getMovie(
  "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bkEw&pkid=68&os=10015835&qvt=0&query=%EC%98%81%ED%99%94%20%EA%B5%90%EC%84%AD"
);
export default getMovie;
