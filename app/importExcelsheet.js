"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelToHtml = ({ title }) => {
  const [data, setData] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData);
    };

    reader.readAsArrayBuffer(file); // ✅ Modern and safe
  };
  return (
    <div>
      <h2>{title}</h2>
      <input type='file' accept='.xlsx, .xls' onChange={handleFileUpload} />

      {data.length > 0 && (
        <table border='1' style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              {data[0].map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExcelToHtml;
