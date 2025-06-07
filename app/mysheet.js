"use client";

import React, { useState } from "react";
import ExcelJS from "exceljs";
import { Download, FileSpreadsheet, Minus, Plus, Trash2 } from "lucide-react";

const Mysheet = () => {
  const [rows, setRows] = useState([
    { name: "", email: "", state: "", mobile: "" },
  ]);
  const [deleteTab, setDeleteTab] = useState(true);
  const clearData = () => {
    if (rows.length >= 1) {
      setRows(rows.slice(0, -1));
    } else {
      alert("At least one row must remain.");
      setRows([...rows, { name: "", email: "", state: "", mobile: "" }]);
    }
  };
  const deleteTable = () => {
    setRows(rows.slice(0, 0));
  };
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };
  const addRow = () => {
    setRows([...rows, { name: "", email: "", state: "", mobile: "" }]);
  };
  console.log(rows);

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.addRow(["name", "email", "state", "mobile"]);

    rows.forEach((row) => {
      worksheet.addRow([row.name, row.email, row.state, row.mobile]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table.xlsx";
    link.click();
  };

  return (
    <div
      className='bg-white rounded-xl shadow-lg p-6 mb-8'
      // style={{ justifyItems: "center", margin: 4 }}
    >
      <div className='flex items-center gap-2 mb-6'>
        <FileSpreadsheet className='w-6 h-6 text-blue-600' />
        <h2 className='text-2xl font-bold text-gray-800'>Create Excel Sheet</h2>
      </div>
      <div className='overflow-x-auto'>
        <table
          id='tableId'
          className='w-full border-collapse border border-gray-300 rounded-lg overflow-hidden'
          // style={{ justifyItems: "center", margin: 4 }}
        >
          <thead>
            <tr className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
              <th className='border border-gray-300 px-4 py-3 text-left font-semibold'>
                Name
              </th>
              <th className='border border-gray-300 px-4 py-3 text-left font-semibold'>
                Email
              </th>
              <th className='border border-gray-300 px-4 py-3 text-left font-semibold'>
                state
              </th>
              <th className='border border-gray-300 px-4 py-3 text-left font-semibold'>
                Mobile
              </th>
            </tr>
          </thead>
          {deleteTab && (
            <tbody>
              {}
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className='hover:bg-gray-50 transition-colors duration-200'
                >
                  <td className='border border-gray-300 p-2'>
                    <input
                      type='text'
                      value={row.name}
                      placeholder='Enter name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      onChange={(e) =>
                        handleChange(idx, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <input
                      type='email'
                      value={row.email}
                      placeholder='Enter name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      onChange={(e) =>
                        handleChange(idx, "email", e.target.value)
                      }
                    />
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <input
                      type='text'
                      value={row.state}
                      placeholder='Enter name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      onChange={(e) =>
                        handleChange(idx, "state", e.target.value)
                      }
                    />
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <input
                      type='number'
                      value={row.mobile}
                      placeholder='Enter name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      onChange={(e) =>
                        handleChange(idx, "mobile", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className='flex flex-wrap gap-3 mt-6 justify-center'>
        <button
          className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
          onClick={addRow}
        >
          <Plus className='w-4 h-4' />
          Add Row
        </button>
        <button
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
          onClick={handleExport}
        >
          <Download className='w-4 h-4' />
          Export to Excel
        </button>
        <button
          className='flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
          onClick={clearData}
        >
          <Minus className='w-4 h-4' />
          Remove Row
        </button>
        <button
          className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
          onClick={deleteTable}
        >
          <Trash2 className='w-4 h-4' />
          Delete Table
        </button>
      </div>
    </div>
  );
};

export default Mysheet;
