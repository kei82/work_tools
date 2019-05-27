#!/usr/bin/env node
"use strict";
const commander = require("commander");

// module
const glob = require("./glob/glob.js");
const shot = require("./screenshots/shot.js");
const imgmin = require("./imgmin/imgmin.js");
const htmlValidate = require("./html-validator/validator.js");

// glob
commander
  .command("glob")
  .description(
    `ワイルドカードでファイルを検索します。(例: npm start -- glob -p "**/*.js,**/*.css" -i "node_modules")`
  )
  .option(
    "-p --pattern <pattern>",
    `ワイルドカードのパターン コンマ(,)で区切ることができます(例: "**/*.txt")`,
    "*"
  )
  .option(
    "-i --ignore <ignore>",
    `ワイルドカードの除外するパターン コンマ(,)で区切ることができます(例: "**/*.html")`,
    "node_modules"
  )
  .option(
    "-r --root <root>",
    `ファイルを探すルートディレクトリ(例: "C:/Users/Desktop/")`,
    process.cwd().replace(/\\/g, "/") + "/"
  )
  .option(
    "-n --name <name>",
    "出力するファイル名(ファイルが作成されます)",
    "filelist.txt"
  )
  .option("-o --output <output>", "出力するフォルダの場所", "output/")
  .option("-a --absolute", "出力するパスを絶対パスにするオプション", false)
  .action(cmd => {
    glob(cmd);
  });

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

// img-min
commander
  .command("imgmin")
  .description(
    "jpg, png, svg, gif の画像ファイルサイズを圧縮します。(例: npm start -- imgmin)"
  )
  .option(
    "-r --root <root>",
    `ファイルの入力元のディレクトリ(例: "input/")`,
    "input/"
  )
  .option(
    "-o --output <output>",
    `ファイルの出力先のディレクトリ(例: "imgmin/")`,
    "output/"
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
    `ファイルの入力元のディレクトリ ワイルドカードが使えます コンマ(,)で区切ることができます(例: "input/**/*.html,!**/includes")`,
    "input/**/*.html,!**/includes"
  )
  .action(cmd => {
    htmlValidate(cmd);
  });

commander.usage("[command] [options]").parse(process.argv);
if (process.argv.length <= 2) commander.help();
