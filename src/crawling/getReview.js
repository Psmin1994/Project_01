import puppeteer from "puppeteer";
import DB from "./db/DB.js";

var getReview = async (urlList) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    // 새로운 페이지를 연다.
    var page = await browser.newPage();

    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768,
    });

    for (let href of urlList) {
      await page.goto(href);

      var click = "";

      var testStr = await page.$$eval(
        "#main_pack > div.sc_new.cs_common_module.case_empasis._au_movie_content_wrap > div.cm_top_wrap._sticky._custom_select._header > div.title_area.type_keep._title_area > h2 > span",
        (element) => {
          if (element.length === 2) return element[1].textContent;
          else return null;
        }
      );

      if (testStr === "상영중") {
        click =
          "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap._sticky._custom_select._header > div.sub_tap_area._scrolling_wrapper_common_tab._scroll_mover > div > div > ul > li:nth-child(5) > a";
      } else {
        click =
          "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap._sticky._custom_select._header > div.sub_tap_area._scrolling_wrapper_common_tab._scroll_mover > div > div > ul > li:nth-child(4) > a";
      }

      await page.waitForSelector(click);

      await page.click(click);

      await page.waitForSelector(
        "#main_pack > div.sc_new.cs_common_module.case_empasis._au_movie_content_wrap > div.cm_content_wrap > div.cm_content_area._cm_content_area_rating > div > div:nth-child(2) > div.lego_review_list._scroller > ul > li:last-child"
      );

      const tmp = await page.$$(
        "#main_pack > div.sc_new.cs_common_module.case_empasis._au_movie_content_wrap > div.cm_content_wrap > div.cm_content_area._cm_content_area_rating > div > div:nth-child(2) > div.lego_review_list._scroller > ul > li"
      );

      const result = [];

      for (let node of tmp) {
        const data = {};

        data.movies_name = await page.$eval(
          "#main_pack > div.sc_new.cs_common_module.case_empasis._au_movie_content_wrap > div.cm_top_wrap._sticky._custom_select._header > div.title_area.type_keep._title_area > h2 > span.area_text_title > strong > a",
          (element) => {
            return element.textContent;
          }
        );

        data.score = await node.$eval("div.area_title_box > div > div.area_text_box", (element) => {
          var tmp = element.textContent.split(")");
          return tmp[1];
        });

        data.comment = await node.$eval("div.area_review_content > div > span.desc._text", (element) => {
          return element.textContent;
        });

        data.user = await node.$eval("dl > dd.this_text_stress._btn_writer", (element) => {
          return element.textContent.replace(/\*/g, "");
        });

        data.date = await node.$eval("dl > dd:nth-child(4)", (element) => {
          return element.textContent.replace(". ", " ");
        });

        result.push(data);
      }

      await DB.insertReview(result);
    }

    // 브라우저를 종료한다.
    await browser.close();

    return console.log("Reviews Done");
  } catch (err) {
    console.log(err);
  }
};

export default getReview;
