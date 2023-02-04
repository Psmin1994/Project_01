import puppeteer from "puppeteer";

var getList = async () => {
  try {
    const url_List = [];
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

    await page.goto("https://movie.naver.com/movie/running/current.naver?view=image&tab=normal&order=likeCount");

    // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
    let lists = await page.$$("#content > div.article > div > div.lst_wrap > ul > li");

    // 모든 리스트를 순환한다.
    for (let list of lists) {
      const href = await list.$eval("a", (element) => {
        return element.href;
      });

      url_List.push(href);
    }

    // 브라우저를 종료한다.
    await browser.close();

    return url_List;
  } catch (e) {
    console.error(e);
  }
};

export default getList;
