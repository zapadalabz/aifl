import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExportToExcel = ({ data, fileName }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = () => {
    let fieldsOrder = ["name","Overall Mark","Organization","Self Regulation","Collaboration","Leadership","comment","id","program"]
    if(data.program === "myp"){
        fieldsOrder = ["name","Overall Mark","A: Analysing", "B: Organizing", "C: Producing text", "D: Using language", "Organization","Self Regulation","Collaboration","Leadership","comment","id","program"]
    }
    const orderedData = data.map(item => {
        const orderedItem = {};
        fieldsOrder.forEach(key => {
          orderedItem[key] = item[key] || null; // Fallback to null if key doesn't exist
        });
        return orderedItem;
      });

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(orderedData);
    const wb = { Sheets: { 'data': ws }, SheetNames:['data'] };
    
    // Write the workbook and convert the data to an array buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Convert the array buffer to Blob
    const dataBlob = new Blob([excelBuffer], { type: fileType });

    // Save the Excel file
    saveAs(dataBlob, fileName + fileExtension);
  };

  return (
    <button className="import_export_button" onClick={exportToCSV}>Export to Excel</button>
  );
};

export default ExportToExcel;