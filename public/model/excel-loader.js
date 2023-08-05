const xlsx = require('xlsx');

module.exports = class ExcelLoader {
    constructor() {
        this.type = 'default';
    };

    loadExcelSheet(filePath, sheetName) {
        const workbook = xlsx.readFile(filePath);
        const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
        return worksheet;
    };
};