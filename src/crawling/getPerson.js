import puppeteer from "puppeteer";
import getImgUrl from "./getImgUrl.js";
import DB from "./db/DB.js";

var getPerson = async (urlList) => {
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

    for (let href of urlList) {
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

      if (roles.length >= 4) roles.length = 3;

      const directorsList = [];
      const actorsList = [];

      for (let role of roles) {
        var personList = await role.$$("div > div > div > ul > li");

        for (let node of personList) {
          const data = {};

          data.movies_name = await page.$eval(
            "#main_pack > div._au_movie_content_wrap > div.cm_top_wrap._sticky._custom_select._header > div.title_area.type_keep._title_area > h2 > span > strong > a",
            (element) => {
              return element.textContent;
            }
          );

          data.role = await role.$eval("h3", (element) => {
            return element.textContent;
          });

          let check1 = await page.evaluate((element) => {
            return element.children[0].nodeName;
          }, node);

          let check2 = await page.evaluate((element) => {
            return element.children[0].children[0].attributes[0].value;
          }, node);

          if (check2 === "area_text_box") {
            continue;
          }

          if (check1 === "A") {
            var img = await node.$eval("a > div > div.thumb > img", (element) => {
              return { url: element.src, name: element.src.split("%").slice(-1) };
            });

            if (
              img.url !==
              "https://ssl.pstatic.net/sstatic/keypage/outside/scui/cs_common_module/im/no_img_people_206x232_v2.png"
            ) {
              data.img = await getImgUrl(img, "person");
            }

            data.name = await node.$eval("a > div > div.title_box > strong > span", (element) => {
              return element.textContent;
            });

            let testStr3 = await node.$eval("a > div > div.title_box", (element) => {
              var tmp = [];
              for (let name of element.children) {
                tmp.push(name.nodeName);
              }
              return tmp;
            });

            if (testStr3[1] === "SPAN") {
              data.roleName = await node.$eval("a > div > div.title_box > span > span", (element) => {
                return element.textContent;
              });
            }
          }
          // else {
          //   data.img = null;
          //   data.name = null;
          //   data.roleName = null;
          // }

          if (data.role === "감독") directorsList.push(data);
          else actorsList.push(data);
        }
      }
      await DB.insertDirector(directorsList);
      await DB.insertActor(actorsList);
    }

    // 브라우저를 종료한다.
    await browser.close();

    return console.log("Person Done");
  } catch (e) {
    console.error(e);
  }
};

export default getPerson;
