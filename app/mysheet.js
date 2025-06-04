"use client";

import React, { useState } from "react";
import ExcelJS from "exceljs";

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
    <div style={{ justifyItems: "center", margin: 4 }}>
      <table id='tableId' style={{ justifyItems: "center", margin: 4 }}>
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>state</th>
            <th>mobile</th>
          </tr>
        </thead>
        {deleteTab && (
          <tbody>
            {}
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    type='text'
                    value={row.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type='email'
                    value={row.email}
                    onChange={(e) => handleChange(idx, "email", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type='text'
                    value={row.state}
                    onChange={(e) => handleChange(idx, "state", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type='number'
                    value={row.mobile}
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
      <div style={{ justifyItems: "center" }}>
        <button style={{ margin: 4, cursor: "pointer" }} onClick={addRow}>
          Add Row
        </button>
        <button style={{ margin: 4, cursor: "pointer" }} onClick={handleExport}>
          Export to Excel
        </button>
        <button style={{ margin: 4, cursor: "pointer" }} onClick={clearData}>
          Remove Row
        </button>
        <button style={{ margin: 4, cursor: "pointer" }} onClick={deleteTable}>
          Delete Table
        </button>
      </div>
    </div>
  );
};

export default Mysheet;
