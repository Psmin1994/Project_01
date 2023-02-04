import puppeteer from "puppeteer";

var getReview = async (href) => {
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

    await page.goto(href);

    await page.waitForSelector(
      "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(5) > a"
    );

    await page.click(
      "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(5) > a"
    );

    const result = [];

    await page.waitForSelector(
      "#main_pack > div._au_movie_content_wrap > div.cm_content_wrap > div.cm_content_area._cm_content_area_chart._cm_content_area_graph_donut > div > div:nth-child(2) > div > div > ul > li:nth-child(1) > div > div.area_intro_info > span.area_star_number"
    );

    result.totalScore = await page.$eval(
      "#main_pack > div._au_movie_content_wrap > div.cm_content_wrap > div.cm_content_area._cm_content_area_chart._cm_content_area_graph_donut > div > div:nth-child(2) > div > div > ul > li:nth-child(1) > div > div.area_intro_info > span.area_star_number",
      (element) => {
        return element.textContent;
      }
    );

    await page.waitForSelector(
      "#main_pack > div._au_movie_content_wrap > div.cm_content_wrap > div.cm_content_area._cm_content_area_rating > div > div:nth-child(2) > div.lego_review_list > ul > li"
    );

    const tmp = await page.$$(
      "#main_pack > div._au_movie_content_wrap > div.cm_content_wrap > div.cm_content_area._cm_content_area_rating > div > div:nth-child(2) > div.lego_review_list > ul > li"
    );

    for (let node of tmp) {
      const data = {};

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

      await result.push(data);
    }
    // 브라우저를 종료한다.
    await browser.close();

    return result;
  } catch (err) {
    console.log(err);
  }
};

export default getReview;
