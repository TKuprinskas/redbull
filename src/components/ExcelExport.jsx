import React from 'react';
import { Button, Tooltip } from '@mui/material';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

const ExcelExport = ({ excelData, fileName }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <Tooltip title="Parsisiųsti visą matomą informaciją excel formatu">
            <Button variant="contained" onClick={() => exportToExcel()} sx={{ width: { xs: '100%', md: 'auto' } }}>
                Eksportuoti į Excel
            </Button>
        </Tooltip>
    );
};

export default ExcelExport;
