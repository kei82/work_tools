module.exports = async auth => {
  /**
   * データの取得
   */
  // 今日から1ヶ月前の日付を取得
  const dayjs = require("dayjs");
  const oneMonthAgo = dayjs().subtract(1, "months");
  const startOfMonth = oneMonthAgo.startOf("month").format("YYYY-MM-DD");
  const endOfMonth = oneMonthAgo.endOf("month").format("YYYY-MM-DD");

  // GoogleAnalyticsデータ取得
  const get_ga = require("./get_ga");

  // get_gaオプション
  const request = {
    resource: {
      reportRequests: [
        {
          viewId: "114422885",
          pageSize: "10",
          dateRanges: [
            {
              startDate: startOfMonth,
              endDate: endOfMonth
            }
          ],
          orderBys: [
            {
              sortOrder: "DESCENDING",
              fieldName: "ga:pageviews"
            }
          ],
          metrics: [
            {
              expression: "ga:sessions",
              alias: "セッション"
            },
            {
              expression: "ga:pageviews",
              alias: "ページビュー"
            }
          ],
          dimensions: [
            {
              name: "ga:keyword"
            }
          ]
        }
      ]
    }
  };
  const ga_result = await get_ga(auth, request);

  /**
   * データの挿入
   */
  // GAのデータを整形
  const rep0 = ga_result.data.reports[0];
  let header = [
    [
      rep0.columnHeader.dimensions.join(","),
      ...rep0.columnHeader.metricHeader.metricHeaderEntries.map(m => {
        return m.name;
      })
    ]
  ];
  let body = rep0.data.rows.map(c => {
    return [c.dimensions.join(","), ...c.metrics[0].values];
  });
  let ssData = {
    header: header,
    body: body
  };

  // EXCEL処理
  const update_excel_1 = require("./update_excel_1");
  update_excel_1(ssData);

  // sheetIDを取得
  const spreadsheetId = "";
  const get_ssid = require("./get_ssid");
  const sheetId = await get_ssid(auth, spreadsheetId, "テスト");

  // SpreadSheetsデータ挿入
  const update_ss = require("./update_ss");

  // update_ssオプション
  const updateVal = {
    spreadsheetId: spreadsheetId,
    resource: {
      valueInputOption: "RAW",
      data: [
        {
          range: "'テスト'!A1",
          values: ssData.header
        },
        {
          range: "'テスト'!A2",
          values: ssData.body
        }
      ]
    }
  };
  update_ss(auth, updateVal);

  const updateAll = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 3
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.0,
                  green: 0.0,
                  blue: 0.0
                },
                textFormat: {
                  foregroundColor: {
                    red: 1.0,
                    green: 1.0,
                    blue: 1.0
                  },
                  fontSize: 12,
                  bold: true
                }
              }
            },
            fields: "userEnteredFormat(backgroundColor,textFormat)"
          }
        }
      ]
    }
  };
  update_ss(auth, updateAll, true);
};
