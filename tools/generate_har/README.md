# generate_har

HAR ファイル(HTTP Archive format)を生成してレポートを出力するツール

## 使い方 (Windows のみ)

config.json に設定をして、generate_har.exe を実行する。  
出力フォルダに HAR ファイルとレポートファイルが出力されます。

## config.json 設定

```json
{
  // 並列実行数
  "pageConcurrency": 3,
  // 起動オプション https://github.com/puppeteer/puppeteer/blob/v10.0.0/docs/api.md#puppeteerlaunchoptions
  "launchOptions": {
    "headless": false,
    "slowMo": 50,
    "executablePath": "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
  },
  // 出力フォルダ
  "outputDir": "output",
  // リクエストするページを設定する
  "pages": [
    { "url": "https://www.members.co.jp/", "filename": "file_1" },
    { "url": "https://www.npmjs.com/", "filename": "file_2" },
    { "url": "https://developer.mozilla.org/ja/", "filename": "file_3" }
  ]
}
```
