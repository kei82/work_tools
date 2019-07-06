#!/usr/bin/env node
"use strict";
const commander = require("commander");

// module
const shot = require("./screenshots/shot.js");
const imgmin = require("./imgmin/imgmin.js");
const htmlValidate = require("./html-validator/validator.js");

// shot
commander
  .command("shot")
  .description(
    "input.csvを元にスクリーンショットを撮影します。設定ファイルはconfig.jsonです。(例: npm start -- shot)"
  )
  .option("-c --config", "設定ファイルを表示して終了します", false)
  .action(cmd => {
    shot(cmd);
  });

// imgmin
commander
  .command("imgmin")
  .description(
    "jpg, png, svg, gif の画像ファイルサイズを圧縮します。(例: npm start -- imgmin)"
  )
  .option(
    "-r --root <root>",
    `ファイルの入力元のディレクトリ(例: "/input/")`,
    "/input/"
  )
  .option(
    "-o --output <output>",
    `ファイルの出力先のディレクトリ(例: "/output/")`,
    "/output/"
  )
  .action(cmd => {
    imgmin(cmd);
  });

// html-validator
commander
  .command("html-validate")
  .alias("hv")
  .description(
    "HTMLをW3Cに基づきバリデーションチェックします。(例: npm start -- hv)"
  )
  .option(
    "-p --pattern <pattern>",
    `ファイルの入力元のディレクトリ ワイルドカードが使えます コンマ(,)で区切ることができます(例: "input/**/*.html")`,
    "input/**/*.html"
  )
  .action(cmd => {
    htmlValidate(cmd);
  });

commander.usage("[command] [options]").parse(process.argv);
if (process.argv.length <= 2) commander.help();
