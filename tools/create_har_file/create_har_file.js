import fs from "fs-extra";
import puppeteer from "puppeteer-core";
import PuppeteerHar from "puppeteer-har";

const outputFolder = process.cwd() + "/output";
fs.mkdirsSync(outputFolder);

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage();

  const har = new PuppeteerHar(page);

  await har.start({ path: outputFolder + "/results.har" });
  await page.goto("https://www.netflix.com/");
  await har.stop();

  await har.start({ path: outputFolder + "/results2.har" });
  await page.goto("https://www.npmjs.com/");
  await har.stop();

  await browser.close();
})();
