import React, { useContext } from 'react';
import * as XLSX from 'xlsx';
import StudentContext from "./StudentContext";
import { toast } from 'react-toastify';

const ImportFromExcel = ({ onDataProcessed }) => {
    const {state, dispatch} = useContext(StudentContext);

    function haveSameKeys(obj1, obj2) {
        const obj1Keys = Object.keys(obj1[0]).sort();
        const obj2Keys = Object.keys(obj2[0]).sort();
        
        if (obj1Keys.length !== obj2Keys.length) {
          return false;
        }

        if(obj1Keys.every((key, index) => key === obj2Keys[index])){
            for (let i = 0; i < obj1.length; i++) {
                if(obj1[i].name !== obj2[i].name){
                    return false;
                }
            }
        }else{
            return false;
        }
        
        return true;
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        // Read the file using file reader
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
            const arrayBuffer = e.target.result;
            
            // Parse the file using XLSX
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

            // Assume the first worksheet is the one we're interested in
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // Convert worksheet to JSON
            const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            // Pass the data up to the parent component
            if (haveSameKeys(data, state.courseList)) {
                for (let i = 0; i < data.length; i++) {
                    const updatedData = { ...data[i] };
                    updatedData['Overall Mark'] = String(updatedData['Overall Mark']);
                    dispatch({
                        type: 'UPDATE_STUDENT',
                        payload: {
                            student_index: i,
                            updates: updatedData,
                        }
                    });
                }
                toast.success("Data imported successfully.");
                onDataProcessed(true);
            } else {
                toast.error("Imported data does not match the template. Please check the file and try again.");
                onDataProcessed(false);
            }
            event.target.value = '';
        };

        // Read the file as array buffer
        fileReader.readAsArrayBuffer(file);
    };

    return (
        <>
            <label htmlFor="file-upload" className="import_export_button">
                Import from Excel
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: 'none' }} // Hide the default input
            />
        </>
    );
};

export default ImportFromExcel;