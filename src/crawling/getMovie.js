import puppeteer from "puppeteer";
import getImgUrl from "./getImgUrl.js";
import DB from "./db/DB.js";

var getMovie = async (urlList) => {
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

    const result = [];

    for (let href of urlList) {
      await page.goto(href);

      await page.waitForSelector(
        "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(2) > a"
      );

      await page.click(
        "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(2) > a"
      );

      await page.waitForSelector("#main_pack > div._au_movie_content_wrap");

      const selector = await page.$("#main_pack > div._au_movie_content_wrap");

      const data = {};

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
          return { url: element.src, name: element.src.split("%").slice(2) };
        }
      );

      data.img = await getImgUrl(img, "movies/poster");

      const infoList = await selector.$$(
        "div.cm_content_wrap > div.cm_content_area > div > div.detail_info > dl > div"
      );

      for (let node of infoList) {
        const key = await node.$eval("dt", (element) => {
          return element.textContent;
        });

        const value = await node.$eval("dd", (element) => {
          return element.textContent;
        });

        switch (key) {
          case "개봉":
            data.openingDate = value.slice(0, -1);
            break;
          case "등급":
            data.filmRate = value;
            break;
          case "장르":
            data.genre = JSON.stringify(value.split(", "));
            break;
          case "국가":
            data.nation = value;
            break;
          case "러닝타임":
            data.runningTime = value.replace("분", "") * 1;
            break;
          default:
            break;
        }
      }

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
            return element.textContent.replace(/\.|,/g, "") * 1;
          }
        );

        data.score = await selector.$eval(
          "div.cm_content_wrap > div.cm_content_area._cm_content_area_graph_rank > div > div.lego_rating_star > ul > li:nth-child(2) > a > div.area_content > span.this_text_bold",
          (element) => {
            return element.textContent * 1;
          }
        );
      }
      result.push(data);
    }

    await DB.insertMovie(result);

    // 브라우저를 종료한다.
    await browser.close();

    return console.log("Movies Done.");
  } catch (err) {
    console.log(err);
  }
};

export default getMovie;
