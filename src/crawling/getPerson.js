import puppeteer from "puppeteer";
import getImgUrl from "./getImgUrl.js";

var getPerson = async (href) => {
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

    await page.waitForSelector(
      "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(3) > a"
    );

    await page.click(
      "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap > div.sub_tap_area > div > div > ul > li:nth-child(3) > a"
    );

    await page.waitForSelector(
      "#main_pack > div._au_movie_content_wrap > div.cm_content_wrap > div > div.sec_scroll_cast_member > div"
    );

    var roles = await page.$$(
      "#main_pack > div._au_movie_content_wrap > div.cm_content_wrap > div > div.sec_scroll_cast_member > div"
    );

    var array = [];

    for (let role of roles) {
      const data = {};

      data.role = await role.$eval("h3", (element) => {
        return element.textContent;
      });

      var tmp = await role.$$("div > div > div > ul > li");

      if (tmp.length === 1) {
        let testStr1 = await page.evaluate((element) => {
          return element.children[0].nodeName;
        }, tmp[0]);

        let testStr2 = await page.evaluate((element) => {
          return element.children[0].children[0].nodeName;
        }, tmp[0]);

        if (!(testStr1 === "DIV" || testStr2 === "SPAN")) {
          var img = await tmp[0].$eval("a > div > div.thumb > img", (element) => {
            return { url: element.src, name: Math.random().toString(36).substring(2, 12) };
          });

          data.img = await getImgUrl(img, "directors");

          data.name = await tmp[0].$eval("a > div > div.title_box > strong > span", (element) => {
            return element.textContent;
          });

          let testNode = await tmp[0].$("a > div > div.title_box");

          let testStr3 = await page.evaluate((element) => {
            var tmp = [];
            for (let name of element.children) {
              tmp.push(name.nodeName);
            }
            return tmp;
          }, testNode);

          if (testStr3[1] === "SPAN") {
            data.roleName = await tmp[0].$eval("a > div > div.title_box > span > span", (element) => {
              return element.textContent;
            });
          }

          array.push(data);
        }
      } else {
        for (let node of tmp) {
          let testStr1 = await page.evaluate((element) => {
            return element.children[0].nodeName;
          }, node);

          let testStr2 = await page.evaluate((element) => {
            return element.children[0].children[0].nodeName;
          }, node);

          if (!(testStr1 === "DIV" || testStr2 === "SPAN")) {
            var img = await node.$eval("a > div > div.thumb > img", (element) => {
              return { url: element.src, name: Math.random().toString(36).substring(2, 12) };
            });

            data.img = await getImgUrl(img, "person");

            data.name = await node.$eval("a > div > div.title_box > strong > span", (element) => {
              return element.textContent;
            });

            let testNode = await node.$("a > div > div.title_box");

            let testStr3 = await page.evaluate((element) => {
              var tmp = [];
              for (let name of element.children) {
                tmp.push(name.nodeName);
              }
              return tmp;
            }, testNode);

            if (testStr3[1] === "SPAN") {
              data.roleName = await node.$eval("a > div > div.title_box > span > span", (element) => {
                return element.textContent;
              });
            }

            array.push(data);
          }
        }
      }
    }

    // 브라우저를 종료한다.
    await browser.close();

    return array;
  } catch (e) {
    console.error(e);
  }
};

export default getPerson;
