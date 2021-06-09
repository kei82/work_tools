import fs from "fs-extra";
import glob from "glob";
import validator from "html-validator";

const outputFolder = process.cwd() + "/output";
const outputFile = outputFolder + "/html-validate.md";

// レポート格納
let errNum = 0;
let result = "# html-validator\n\n";
const writeValidate = async (path) => {
  const fsData = fs.readFileSync(path);
  const validatData = await validator({ data: fsData });

  const messages = JSON.parse(validatData).messages;
  if (messages.length) {
    errNum++;
    result += `## ${path}\n\n`;
    for (let m of messages) {
      result += `### [${m.type}] ${path}:${m.lastLine}:${m.lastColumn}\n`;
      result += `* ${m.message}  \n`;
      if (m.extract) result += `* \`${m.extract.replace(/\n/g, "")}\`\n\n`;
    }
  }
};

// ファイル検索して関数実行
const globAction = async (func) => {
  const files = await glob.sync(process.cwd() + "/input/**/*.html", {
    nodir: true,
  });
  for (let file of files) {
    if (func) await func(file);
  }
};

// レポート出力
const outputValidate = async () => {
  await globAction(writeValidate);
  if (errNum) {
    console.error(`${errNum} file issues!`);
    fs.outputFileSync(outputFile, result);
  } else {
    console.log("No issues!");
  }
};

outputValidate();
