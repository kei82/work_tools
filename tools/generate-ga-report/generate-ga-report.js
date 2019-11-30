// 認証処理
const getToken = require("./get_token");

// 出力処理
const app_1 = require("./app_1");
const app_2 = require("./app_2");

// 実行
(async () => {
  const token = await getToken();
  app_1(token);
  // app_2(token);
})();
