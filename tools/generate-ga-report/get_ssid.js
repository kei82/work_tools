module.exports = (auth, request, sheetName = false) => {
  const { google } = require("googleapis");
  const sheets = google.sheets({ version: "v4", auth: auth });
  request = {
    spreadsheetId: request
  }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get(request, (err, response) => {
      if (err) throw err;
      if (sheetName) {
        for (let sheet of response.data.sheets) {
          if (sheet.properties.title === sheetName)
            resolve(sheet.properties.sheetId);
        }
      } else {
        resolve(response.data.sheets); // arraylist
      }
    });
  });
};
