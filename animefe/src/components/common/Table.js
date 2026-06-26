import React from 'react';
import Loading from './Loading';

const Table = ({
  headers = [],
  data = [],
  isLoading = false,
  sortConfig = null,
  onSort = null,
  renderRow = null,
  emptyMessage = 'Không có dữ liệu',
  className = '',
}) => {
  const handleHeaderClick = (header) => {
    if (header.sortable && onSort) {
      const newDirection =
        sortConfig && sortConfig.key === header.key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc';
      onSort({ key: header.key, direction: newDirection });
    }
  };

  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/20 backdrop-blur-sm ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-300 font-medium">
            {headers.map((header, index) => {
              const isSortable = header.sortable;
              const isSorted = sortConfig && sortConfig.key === header.key;
              const direction = isSorted ? sortConfig.direction : null;

              return (
                <th
                  key={header.key || index}
                  onClick={() => handleHeaderClick(header)}
                  className={`px-6 py-4 select-none ${isSortable ? 'cursor-pointer hover:bg-slate-900/60 hover:text-slate-100 transition-colors' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{header.label}</span>
                    {isSortable && (
                      <span className="text-slate-500">
                        {direction === 'asc' ? (
                          <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4l-8 8h16z" />
                          </svg>
                        ) : direction === 'desc' ? (
                          <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 20l8-8H4z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4l-5 5h10zm0 16l5-5H7z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900 text-slate-300">
          {isLoading ? (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center">
                <Loading size="sm" text="Đang tải dữ liệu..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : renderRow ? (
            data.map((row, index) => renderRow(row, index))
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-slate-900/30 transition-colors">
                {headers.map((header, hIndex) => (
                  <td key={hIndex} className="px-6 py-4 whitespace-nowrap">
                    {row[header.key] !== undefined ? String(row[header.key]) : '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
