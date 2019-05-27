module.exports = async cmd => {
  const fs = require("fs-extra");
  const puppeteer = require("puppeteer-core");
  const csvParse = require("csv-parse/lib/sync");

  require("events").EventEmitter.defaultMaxListeners = 30;
  let conf = fs.readJsonSync(__dirname + "/config.json"); // 設定ファイル読み込み
  let csvParseOptions = {
    columns: true,
    skip_empty_lines: true
  };
  let pages = csvParse(
    fs.readFileSync(__dirname + "/" + conf.input_csv), // CSVファイル読み込み
    csvParseOptions
  );
  fs.mkdirsSync(conf.output_folder); // 出力フォルダ作成

  if (cmd.config) {
    console.log(conf);
    process.exit();
  }

  process.on("unhandledRejection", error => {
    console.error(error);
    process.exit(1);
  });

  const browser = await puppeteer.launch({
    executablePath: conf.chromium_path
  });
  let promiseList = [];
  for (let viewport of conf.viewport) {
    for (let target of pages) {
      promiseList.push(
        (async () => {
          const page = await browser.newPage();
          await page.setExtraHTTPHeaders({
            Authorization: `Basic ${Buffer.from(
              `${conf.basic_username}:${conf.basic_password}`
            ).toString("base64")}`
          });
          await page.setViewport({ width: viewport.width, height: 1 });
          const response = await page.goto(target.url, {
            waitUntil: "networkidle2"
          });

          if (response.status() !== 200) {
            console.error("Not status 200", target.url);
            return [];
          }

          const fileName = conf.output_filename
            .replace(/{{name}}/g, target.filename)
            .replace(/{{device}}/g, viewport.device);
          await page.screenshot({
            path: conf.output_folder + "/" + fileName,
            fullPage: true,
            type: conf.file_type
          });
          await page.close();

          console.log(fileName);
          return fileName;
        })()
      );
    }
  }

  await Promise.all(promiseList);
  await browser.close();
  console.log("\nScreenshots Completion!");
};
