import puppeteer from "puppeteer";

var getReview = async (href) => {
  try {
    var result = [];

    const browser = await puppeteer.launch({
      headless: false,
    });

    // 새로운 페이지를 연다.
    var page = await browser.newPage();

    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768,
    });

    await page.goto(href);

    await page.waitForSelector("#movieEndTabMenu > li:nth-child(5) > a");

    await page.click("#movieEndTabMenu > li:nth-child(5) > a");

    await page.waitForSelector("#pointAfterListIframe");

    const iframeTag = await page.$("#pointAfterListIframe");

    const frame = await iframeTag.contentFrame();

    await page.goto(frame.url());

    var num = await page.$eval("body > div > div > div.score_total > strong > em", (element) => {
      return element.textContent;
    });

    const tmp = await page.$$("body > div > div > div.score_result > ul > li");
    var index = 0;

    for (let node of tmp) {
      const data = {};

      data.score = await node.$eval("div.star_score > em", (element) => {
        return element.textContent;
      });

      data.comment = await node.$eval(`#_filtered_ment_${index}`, (element) => {
        return element.textContent;
      });

      data.user = await node.$eval("div.score_reple > dl > dt > em:nth-child(1) > a > span", (element) => {
        return element.textContent;
      });

      data.date = await node.$eval("div.score_reple > dl > dt > em:nth-child(2)", (element) => {
        return element.textContent;
      });

      await result.push(data);

      index++;
    }

    for (var i = 1; i <= num / 10; i++) {
      await page.waitForSelector(`#pagerTagAnchor${i + 1}`);

      await page.click(`#pagerTagAnchor${i + 1}`);

      const tmp = await page.$$("body > div > div > div.score_result > ul > li");

      index = 0;

      for (let node of tmp) {
        const data = {};

        data.score = await node.$eval("div.star_score > em", (element) => {
          return element.textContent;
        });

        data.comment = await node.$eval(`#_filtered_ment_${index}`, (element) => {
          return element.textContent.replace(/\t|\n/g, "");
        });

        var string = await node.$eval("div.score_reple > dl > dt > em:nth-child(1) > a > span", (element) => {
          return element.textContent.replace(/\*|\)/g, "").split(String.fromCharCode(40));
        });

        data.userNickname = string[0];
        data.userId = string[1];

        data.date = await node.$eval("div.score_reple > dl > dt > em:nth-child(2)", (element) => {
          return element.textContent;
        });

        await result.push(data);

        index++;
      }
    }

    // 브라우저를 종료한다.
    await browser.close();

    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
};

getReview("https://movie.naver.com/movie/bi/mi/point.naver?code=207938");

export default getReview;
