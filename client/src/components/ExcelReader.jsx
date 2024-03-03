import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const ExcelReader = () => {
  const [tableData, setTableData] = useState([]);
  const [selected, setSelected] = useState(new Set());

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(data);
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const toggleSelection = (index) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an Excel file here, or click to select one</p>
      </div>
      {tableData.length > 0 && (
        <table>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                <td style={{ cursor: 'pointer' }} onClick={() => toggleSelection(index)}>
                  {selected.has(index) ? '-' : '+'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelReader;
