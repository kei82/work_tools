import fs from "fs-extra";
import puppeteer from "puppeteer-core";
import PuppeteerHar from "puppeteer-har";

(async () => {
  console.log("Running...");

  const config = fs.readJSONSync("tools/generate_har/config.json");
  const promiseList = [];
  const pageList = [];
  const reportList = [];

  fs.emptyDirSync(config.outputDir);

  const pagesInfo = (function* () {
    for (const page of config.pages) {
      yield page;
    }
  })();

  const browser = await puppeteer.launch(config.launchOptions);

  const addReportList = ({ url, filename, harFile }) => {
    const harData = fs.readJSONSync(harFile);
    const requestsURL = harData.log.entries.map(({ request }) => request.url);
    reportList.push({ url, filename, harFile, requestsURL });
  };

  const promiseItem = async () => {
    const page = await browser.newPage();
    const har = new PuppeteerHar(page);

    for (const pageInfo of pagesInfo) {
      const path = `${config.outputDir}/${pageInfo.filename}.har`;

      await har.start({ path });

      const response = await page.goto(pageInfo.url, {
        waitUntil: "networkidle2",
      });

      if (/[4,5]\d{2}/.test(response.status())) {
        console.error(`Error status ${response.status()}: ${pageInfo.url}`);
        await har.stop();
        continue;
      }

      await har.stop();

      pageList.push({ ...pageInfo, harFile: path });
    }

    await page.close();
  };

  for (let index = 0; index < config.pageConcurrency; index++) {
    promiseList.push(promiseItem());
  }

  await Promise.all(promiseList).catch(console.error);

  await browser.close();

  for (const page of pageList) {
    addReportList(page);
  }

  fs.writeJSONSync(
    `${config.outputDir}/_report.json`,
    { reportList },
    { spaces: 2 }
  );

  console.log("\nCompleted!");
})();
