import React from 'react';
import './Table.css';

const Table = ({ columns, data, isLoading, emptyMessage = 'No data available' }) => {
  if (isLoading) {
    return <div className="table-loading">Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`table__th table__th--${col.align || 'left'}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row._id || row.id || rowIndex} className="table__tr">
              {columns.map((col) => (
                <td key={col.key} className={`table__td table__td--${col.align || 'left'}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;