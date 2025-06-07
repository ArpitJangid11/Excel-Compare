"use client";

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

const ExcelComparator = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [combinedHeaders, setCombinedHeaders] = useState([]);

  const handleFileUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (event) => {
      const buffer = event.target.result;
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];

      const rows = [];
      const headerRow = worksheet.getRow(1);
      const headers = [];

      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        headers.push(cell.value);
      });

      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value;
        });
        rows.push(rowData);
      });

      setter(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const headers1 = data1.length > 0 ? Object.keys(data1[0]) : [];
    const headers2 = data2.length > 0 ? Object.keys(data2[0]) : [];
    const merged = Array.from(new Set([...headers1, ...headers2]));
    setCombinedHeaders(merged);
  }, [data1, data2]);

  const getCompareRows = () => {
    const maxLength = Math.max(data1.length, data2.length);
    const compare = [];

    for (let i = 0; i < maxLength; i++) {
      if (i < data1.length) compare.push({ sheet: "Sheet 1", ...data1[i] });
      if (i < data2.length) compare.push({ sheet: "Sheet 2", ...data2[i] });
    }

    return compare;
  };

  const compareRows = getCompareRows();

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Compare Data");

    worksheet.addRow(["Source", ...combinedHeaders]);

    compareRows.forEach((row) => {
      worksheet.addRow([
        row.sheet,
        ...combinedHeaders.map((header) => row[header] || ""),
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compare_data.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='bg-white rounded-xl shadow-lg p-6'>
      <div className='flex items-center gap-2 mb-6'>
        <FileSpreadsheet className='w-6 h-6 text-purple-600' />
        <h2 className='text-2xl font-bold text-gray-800'>
          Excel Sheet Comparator
        </h2>
      </div>
      <div>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Upload Sheet 1:
          </label>
          <div className='relative'>
            <input
              type='file'
              accept='.xlsx, .xls'
              onChange={(e) => handleFileUpload(e, setData1)}
              className='hidden'
              id='file1'
            />
            <label
              htmlFor='file1'
              className='flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200'
            >
              <Upload className='w-5 h-5 text-gray-400' />
              <span className='text-gray-600'>Choose Excel file</span>
            </label>
          </div>
          {data1.length > 0 && (
            <p className='text-sm text-green-600 font-medium'>
              ✓ {data1.length} rows loaded
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Upload Sheet 2:
          </label>
          <div className='relative'>
            <input
              type='file'
              accept='.xlsx, .xls'
              onChange={(e) => handleFileUpload(e, setData2)}
              className='hidden'
              id='file2'
            />
            <label
              htmlFor='file2'
              className='flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors duration-200'
            >
              <Upload className='w-5 h-5 text-gray-400' />
              <span className='text-gray-600'>Choose Excel file</span>
            </label>
          </div>
          {data2.length > 0 && (
            <p className='text-sm text-green-600 font-medium'>
              ✓ {data2.length} rows loaded
            </p>
          )}
        </div>
      </div>

      {compareRows.length > 0 && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-xl font-semibold text-gray-800'>
              Comparison Results
            </h3>
            <button
              onClick={exportToExcel}
              className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
            >
              <Download className='w-4 h-4' />
              Export Comparison
            </button>
          </div>
          <div className='overflow-x-auto rounded-lg border border-gray-200'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gradient-to-r from-gray-50 to-gray-100'>
                  <th className='border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-100'>
                    Source
                  </th>
                  {combinedHeaders.map((header) => (
                    <th
                      key={header}
                      className='border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 min-w-[120px]'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      row.sheet === "Sheet 1" ? "bg-blue-50" : "bg-purple-50"
                    }`}
                  >
                    <td
                      className={`border border-gray-300 px-4 py-3 font-medium sticky left-0 ${
                        row.sheet === "Sheet 1"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {row.sheet}
                    </td>
                    {combinedHeaders.map((header) => (
                      <td
                        key={header}
                        className='border border-gray-300 px-4 py-3 text-gray-700'
                      >
                        {typeof row[header] === "object" && row[header] !== null
                          ? JSON.stringify(row[header])
                          : row[header] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelComparator;
