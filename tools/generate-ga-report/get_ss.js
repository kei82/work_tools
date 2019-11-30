module.exports = (auth, request) => {
  const { google } = require("googleapis");
  const sheets = google.sheets({ version: "v4", auth: auth });

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.batchGet(request, (err, response) => {
      if (err) throw err;
      resolve(response);
    });
  });
};
