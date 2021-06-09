import fs from "fs-extra";
import puppeteer from "puppeteer-core";

(async () => {
  /**
   * 設定ファイル読み込み
   */
  const conf = fs.readJsonSync("tools/screenshots/config.json");

  /**
   * 出力フォルダ作成
   */
  fs.mkdirsSync(process.cwd() + "/" + conf.output_folder);

  const task = (function* () {
    for (const page of conf.pages) {
      for (const viewport of conf.viewport) {
        yield {
          ...page,
          ...viewport,
        };
      }
    }
  })();

  const browser = await puppeteer.launch({
    executablePath: conf.chromium_path,
  });

  const promiseItem = async () => {
    const page = await browser.newPage();

    for (const value of task) {
      const { url, filename, width, device, emulate } = value;

      if (conf.basic_username && conf.basic_password) {
        await page.authenticate({
          username: conf.basic_username,
          password: conf.basic_password,
        });
      }

      if (emulate) await page.emulate(puppeteer.devices[emulate]);
      await page.setViewport({ width, height: 1 });

      const response = await page.goto(url, {
        waitUntil: "networkidle2",
      });

      if (/[4,5]\d{2}/.test(response.status())) {
        console.error(`Error status ${response.status()}: ${url}`);
        continue;
      }

      const outputFilename = conf.output_filename
        .replace(/{{name}}/g, filename)
        .replace(/{{device}}/g, device);

      await page.screenshot({
        path: conf.output_folder + "/" + outputFilename,
        fullPage: true,
        type: conf.file_type,
      });

      console.log(outputFilename);
    }

    await page.close();
  };

  const pageConcurrency = 3;
  const promiseList = [];

  for (let index = 0; index < pageConcurrency; index++) {
    promiseList.push(promiseItem());
  }

  await Promise.all(promiseList).catch(console.error);

  await browser.close();

  console.log("\nScreenshots Completed!");

  setTimeout(() => {}, 3000);
})();
