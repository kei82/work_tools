module.exports = (auth, request, noValues = false) => {
  const { google } = require("googleapis");
  const sheets = google.sheets({ version: "v4", auth: auth });

  // 値をアップデートする
  if (noValues) {
    sheets.spreadsheets.batchUpdate(request, (err, response) => {
      if (err) throw err;
    });
  } else {
    sheets.spreadsheets.values.batchUpdate(request, (err, response) => {
      if (err) throw err;
    });
  }
};
