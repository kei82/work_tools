module.exports = (auth, request) => {
  const { google } = require("googleapis");
  const analytics = google.analyticsreporting({ version: "v4", auth: auth });

  return new Promise((resolve, reject) => {
    analytics.reports.batchGet(request, (err, response) => {
      if (err) throw err;
      resolve(response);
    });
  });
};
