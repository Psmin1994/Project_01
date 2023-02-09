import puppeteer from "puppeteer";

var getList = async () => {
  try {
    const url_List = [];

    // 테스트용
    // const nameList = [];

    var crawlList = async () => {
      // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
      let lists = await page.$$(
        "#main_pack > div.sc_new.cs_common_module.case_list.color_1._au_movie_list_content_wrap > div.cm_content_wrap > div > div > div > div.card_content._result_area > div.card_area._panel > div"
      );

      // 모든 리스트를 순환한다.
      for (let list of lists) {
        const href = await list.$eval("div.data_area > div > div.title._ellipsis > div > a", (element) => {
          return element.href;
        });

        url_List.push(href);

        // 테스트용
        // const name = await list.$eval("div.data_area > div > div.title._ellipsis > div > a", (element) => {
        //   return element.textContent;
        // });

        // nameList.push(name);
      }
    };

    // 브라우저를 실행한다.
    // 옵션으로 headless모드를 끌 수 있다.
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

    await page.goto(
      "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%98%81%ED%99%94&oquery=%EC%98%81%ED%99%94&tqi=h93mGwp0JywssjmcDAZssssstB0-473391"
    );

    const pageNum = await page.$eval(
      "#main_pack > div.sc_new.cs_common_module.case_list.color_1._au_movie_list_content_wrap > div.cm_content_wrap > div > div > div > div.card_content._result_area > div.cm_paging_area._page > div > span > span._total",
      (element) => {
        return element.textContent;
      }
    );

    for (var i = 1; i < pageNum; i++) {
      await crawlList();
      // nameList.push("----------");

      await page.click(
        "#main_pack > div.sc_new.cs_common_module.case_list.color_1._au_movie_list_content_wrap > div.cm_content_wrap > div > div > div > div.card_content._result_area > div.cm_paging_area._page > div > a.pg_next.on._next"
      );
      await page.waitForTimeout(2 * 1000);
    }

    await crawlList();

    // 테스트
    // console.log(nameList);

    // 브라우저를 종료한다.
    await browser.close();

    return url_List;
  } catch (e) {
    console.error(e);
  }
};

export default getList;
