const fs = require("fs-extra");
const puppeteer = require("puppeteer-core");
const csvParse = require("csv-parse/lib/sync");

const devices = puppeteer.devices;

(async () => {
  const conf = fs.readJsonSync(__dirname + "/config.json"); // 設定ファイル読み込み
  const pages = csvParse(
    fs.readFileSync(__dirname + "/" + conf.input_csv), // CSVファイル読み込み
    {
      columns: true,
      skip_empty_lines: true,
    }
  );
  fs.mkdirsSync(process.cwd() + "/" + conf.output_folder); // 出力フォルダ作成

  const task = (function* () {
    for (const target of pages) {
      for (const viewport of conf.viewport) {
        yield {
          ...target,
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

      if (emulate) await page.emulate(devices[emulate]);
      await page.setViewport({ width, height: 1 });

      const response = await page.goto(url, {
        waitUntil: "networkidle2",
      });

      if (response.status() !== 200) {
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

  const pageTab = 3;
  const promiseList = [];

  for (let index = 0; index < pageTab; index++) {
    promiseList.push(promiseItem());
  }

  await Promise.all(promiseList)
    .then(() => {
      console.log("\nScreenshots Completed!");
    })
    .catch((error) => {
      console.error(error);
    });
  setTimeout(() => {}, 3000);

  await browser.close();
})();
