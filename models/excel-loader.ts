import xlsx from 'xlsx';

class ExcelLoader {
    type: string = 'default';

    loadExcelSheet(filePath: string, sheetName: string): any {
        const workbook = xlsx.readFile(filePath);
        const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
        return worksheet;
    };
};

export default ExcelLoader;


