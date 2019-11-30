module.exports = scopeUrls => {
  const fs = require("fs-extra");
  const readline = require("readline");
  const { google } = require("googleapis");

  const scopes = scopeUrls || [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/spreadsheets"
  ];
  const credentials_path = __dirname + "/keys/credentials.json";
  const token_path = __dirname + "/keys/token.json";

  return new Promise((resolve, reject) => {
    // client secrets 読み込み
    fs.readJson(credentials_path, (err, content) => {
      if (err) {
        console.error(
          "credentials.jsonが読み込めませんでした\n" +
            credentials_path +
            "\nファルダにcredentials.json [installed]を保存してください:\n"
        );
        fs.mkdirpSync(credentials_path.replace(/\/[^\/]*$/, "/"));
        throw err;
      }
      authorize(content);
    });

    // OAuth2認証
    const authorize = credentials => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      fs.readJson(token_path, (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(token);
        resolve(oAuth2Client);
      });
    };

    // 新しいトークンを取得して保存する
    const getAccessToken = oAuth2Client => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes
      });
      console.log("このURLを開いて承認してください:\n", authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question("表示されたコードをコピーして貼り付けてください:\n", code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) console.error("アクセストークンの取得エラー:\n", err);
          oAuth2Client.setCredentials(token);
          fs.writeJSON(token_path, token, err => {
            if (err) throw err;
            console.log("アクセストークンが保存されました:\n", token_path);
          });
          resolve(oAuth2Client);
        });
      });
    };
  });
};
