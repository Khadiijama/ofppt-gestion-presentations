import React from 'react';

const TableStylisee = ({ headers, data, renderRow }) => {
  return (
    <div className="table-container fade-in">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                Aucune donnée disponible.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableStylisee;
