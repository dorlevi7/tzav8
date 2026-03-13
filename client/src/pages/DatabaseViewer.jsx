import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import usePageTitle from "../hooks/usePageTitle";

import "../styles/pages/DatabaseViewer.css";

function DatabaseViewer() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { setLoading } = useLoading();

  const [tables, setTables] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  usePageTitle("Database Debug");

  /* Load tables */

  useEffect(() => {
    const loadTables = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/db/tables`);
        const data = await response.json();

        setTables(data);
      } catch (err) {
        console.error("Failed to load tables", err);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  /* Load table data */

  const loadTableData = async (tableName) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/db/table/${tableName}`);
      const data = await response.json();

      setRows(data);
      setSelectedTable(tableName);
    } catch (err) {
      console.error("Failed to load table data", err);
    } finally {
      setLoading(false);
    }
  };

  /* Render table */

  const renderTable = () => {
    if (!rows.length) return <p>No rows</p>;

    const columns = Object.keys(rows[0]);

    return (
      <div className="db-table-wrapper" dir="ltr">
        <table className="db-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => {
                  const value = row[col] ?? "";

                  return (
                    <td key={col} title={String(value)}>
                      {String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="db-debug-container" dir="ltr">
      <h1 className="db-title">Database Debug</h1>

      <div className="db-tables-top">
        {tables.map((table) => (
          <button
            key={table.table_name}
            onClick={() => loadTableData(table.table_name)}
            className="db-table-button"
          >
            {table.table_name}
          </button>
        ))}
      </div>

      {selectedTable && <h3 className="db-selected-table">{selectedTable}</h3>}

      {renderTable()}
    </div>
  );
}

export default DatabaseViewer;
