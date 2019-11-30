module.exports = async auth => {
  // SpreadSheetsデータ取得
  const get_ss = require("./get_ss");
  const request = {
    spreadsheetId: "",
    ranges: ["'テスト'!A1:B3"]
  };
  const ss_result = await get_ss(auth, request);
  console.log(ss_result.data);
};
