module.exports = response => {
  const exceljs = require("exceljs");
  const workbook = new exceljs.Workbook();
  const workbookPath = "result.xlsx";

  // ファイルを読み込みデータを挿入
  workbook.xlsx.readFile(workbookPath).then(() => {
    const worksheet = workbook.getWorksheet(1);

    for (let index = 0; index < response.header.length; index++) {
      let rowNum = 1;
      worksheet.getRow(index + rowNum).values = response.header[index];
      worksheet.getRow(index + rowNum).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" }
      };
      worksheet.getRow(index + rowNum).font = {
        color: { argb: "FFFFFFFF" }
      };
    }
    for (let index = 0; index < response.body.length; index++) {
      let rowNum = 2;
      worksheet.getRow(index + rowNum).values = response.body[index];
    }

    workbook.xlsx.writeFile(workbookPath);
  });
};
