"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ExcelComparator = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [combinedHeaders, setCombinedHeaders] = useState([]);

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setter(json);
    };
    reader.readAsArrayBuffer(file);
  };

  // Update combined headers when data1 or data2 changes
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

  // Export function
  const exportToExcel = () => {
    const worksheetData = [
      ["Source", ...combinedHeaders],
      ...compareRows.map((row) => [
        row.sheet,
        ...combinedHeaders.map((header) => row[header] || ""),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "compare Data");
    XLSX.writeFile(workbook, "compare_data.xlsx");
  };

  return (
    <div
      className='p-4 max-w-4xl mx-auto'
      style={{ padding: 4, margin: "auto" }}
    >
      <h2 className='text-xl font-bold mb-4'>Excel Sheet Comparator</h2>

      <div>
        <label>
          Upload Sheet 1:
          <input
            style={{ margin: 4, cursor: "pointer" }}
            type='file'
            accept='.xlsx, .xls'
            onChange={(e) => handleFileUpload(e, setData1)}
          />
        </label>
        <label>
          Upload Sheet 2:
          <input
            type='file'
            accept='.xlsx, .xls'
            onChange={(e) => handleFileUpload(e, setData2)}
          />
        </label>
      </div>

      {compareRows.length > 0 && (
        <div className={"mt-6 "} style={{ overflowAnchor: "scroll" }}>
          <h3 className='text-lg font-semibold mb-2'>compare Rows:</h3>
          <table className='w-full border border-gray-300'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='border px-2 py-1'>Source</th>
                {combinedHeaders.map((header) => (
                  <th key={header} className='border px-2 py-1'>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, idx) => (
                <tr key={idx} className='border'>
                  <td className='border px-2 py-1'>{row.sheet}</td>
                  {combinedHeaders.map((header) => (
                    <td key={header} className='border px-2 py-1'>
                      {row[header] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={exportToExcel}
            style={{ margin: 4, cursor: "pointer" }}
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelComparator;
