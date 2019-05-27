module.exports = cmd => {
  const fs = require("fs-extra");
  const readlineSync = require("readline-sync");
  const globby = require("globby");

  // 検索設定
  let globOptions = {
    cwd: cmd.root,
    matchBase: true,
    onlyFiles: true,
    ignore: cmd.ignore.split(","),
    absolute: cmd.absolute
  };

  // ファイル検索して関数実行
  const globAction = async func => {
    let files = await globby(cmd.pattern.split(","), globOptions);
    if (!cmd.absolute && cmd.root)
      files.map(file => file.replace(cmd.root, ""));
    for (let file of files) {
      if (func) func(file);
    }
  };

  // 選択肢
  let actions = ["display", "output", "remove", "move", "copy"];
  let index = readlineSync.keyInSelect(actions, "Select Number");

  // 選択肢の処理
  const display = file => {
    console.log("\x1b[36m%s", file, "\x1b[0m");
  };
  const output = file => {
    fs.appendFileSync(cmd.output + cmd.name, (file += "\n"));
  };
  const remove = file => {
    fs.remove(cmd.root + file);
  };
  const move = file => {
    fs.move(cmd.root + file, cmd.output + file);
  };
  const copy = file => {
    fs.copy(cmd.root + file, cmd.output + file);
  };

  // 選択肢の判定
  switch (actions[index]) {
    case "display":
      globAction(display);
      break;
    case "output":
      fs.mkdirSync(cmd.output);
      globAction(output);
      break;
    case "remove":
      globAction(remove);
      break;
    case "move":
      globAction(move);
      break;
    case "copy":
      globAction(copy);
      break;
    default:
      console.log("CANCELED");
      break;
  }
};
