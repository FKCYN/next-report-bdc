import { saveAs } from "file-saver";
import { Parser } from "json2csv";
import * as XLSX from "xlsx";
  // 📌 Export CSV
  const exportCSV = () => {
    const fields = Object.keys(data[0] || {}); // เอาหัวตารางจากข้อมูล
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "iProgressReport.csv");
  };

  // 📌 Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "iProgressReport.xlsx");
  };

    return (
        <div>
            <button
            onClick={exportCSV}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
            Export CSV
            </button>
            <button
            onClick={exportExcel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            Export Excel
            </button>
        </div>
        ); 