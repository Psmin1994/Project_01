import puppeteer from "puppeteer";
import getImgUrl from "./getImgUrl.js";

var getMovie = async (href) => {
  try {
    var result = [];

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

    const selector = await page.$("#content > div.article > div.mv_info_area > div.mv_info");

    data.name = {};

    data.name.korean = await selector.$eval("h3 > a:nth-child(1)", (element) => {
      return element.textContent;
    });

    data.name.english = await selector.$eval("strong", (element) => {
      return element.textContent;
    });

    data.show = await selector.$eval("h3 > a > em", (element) => {
      return element.textContent;
    });

    data.score = await selector.$$eval("#actualPointPersentBasic > div > em", (element) => {
      var data = "";
      for (let em of element) {
        data += em.textContent;
      }
      return data;
    });

    const img = await page.$eval("#content > div.article > div.mv_info_area > div.poster > a > img", (element) => {
      return { url: element.src, name: Math.random().toString(36).substring(2, 12) };
    });

    data.img = await getImgUrl(img, "movie");

    var tmp = await selector.$$eval("dl > dd:nth-child(2) > p > span:nth-child(1) > a", (element) => {
      tmp = [];
      for (let a of element) {
        tmp.push(a.textContent);
      }
      return tmp;
    });

    data.genre = JSON.stringify(tmp);

    data.nation = await selector.$eval("dl > dd:nth-child(2) > p > span:nth-child(2) > a", (element) => {
      return element.textContent;
    });

    data.runningTime = await selector.$eval("dl > dd:nth-child(2) > p > span:nth-child(3)", (element) => {
      return element.textContent;
    });

    data.openingDate = await selector.$$eval("dl > dd:nth-child(2) > p > span:nth-child(4) > a", (element) => {
      var data = "";
      for (let a of element) {
        data += a.textContent;
      }
      return data;
    });

    data.filmrate = await selector.$eval("dl > dd:nth-child(8) > p > a", (element) => {
      return element.textContent;
    });

    data.totalAudience = await selector.$eval("dl > dd:nth-child(10) > div > p", (element) => {
      return element.textContent;
    });

    await result.push(data);

    console.log(result);

    // 브라우저를 종료한다.
    await browser.close();

    return result;
  } catch (err) {
    console.log(err);
  }
};

getMovie("https://movie.naver.com//movie/bi/mi/detail.naver?code=136873");

export default getMovie;
