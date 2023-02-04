import puppeteer from "puppeteer";
import getImgUrl from "./getImgUrl.js";

var getActor = async (href) => {
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

    let tmp = await page.$$(
      "#content > div.article > div.section_group.section_group_frst > div.obj_section.noline > div > div.lst_people_area.height100 > ul > li"
    );

    for (let node of tmp) {
      const data = {};
      const img = await node.$eval("p > a > img", (element) => {
        return { url: element.src, name: element.alt };
      });

      data.img = await getImgUrl(img, "actor");

      data.name = await node.$eval("div > a", (element) => {
        return element.textContent;
      });

      data.eName = await node.$eval("div > em", (element) => {
        return element.textContent;
      });

      data.role = await node.$eval("div > div > p.in_prt > em", (element) => {
        return element.textContent;
      });

      data.roleName = await node.$eval("div > div > p.pe_cmt > span", (element) => {
        return element.textContent;
      });

      result.push(data);
    }

    // 브라우저를 종료한다.
    await browser.close();

    console.log(result);
    return result;
  } catch (e) {
    console.error(e);
  }
};

getActor("https://movie.naver.com//movie/bi/mi/detail.naver?code=136873");
export default getActor;
