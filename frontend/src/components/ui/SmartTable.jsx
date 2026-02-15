import React from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';

const SmartTable = ({ columns, data = [], pagination, onPageChange, onEdit, onDelete }) => {
  // Defensive check for Pagination values to prevent NaN errors
  const safePage = pagination && !Number.isNaN(Number(pagination.page)) ? pagination.page : 1;
  const safePages = pagination && !Number.isNaN(Number(pagination.pages)) ? pagination.pages : 1;
  const showPagination = pagination && safePages > 1;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={row._id || rowIdx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* Check if render exists, else safely render accessor, casting NaN to string or fallback */}
                      {col.render ? col.render(row, rowIdx) : (
                         Number.isNaN(row[col.accessor]) ? '-' : row[col.accessor]
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                    <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit size={18} />
                    </button>
                    )}
                    {onDelete && (
                    <button onClick={() => onDelete(row._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                    )}
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
                disabled={safePage === 1}
                onClick={() => onPageChange(safePage - 1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button 
                disabled={safePage === safePages}
                onClick={() => onPageChange(safePage + 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{safePage}</span> of <span className="font-medium">{safePages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  disabled={safePage === 1}
                  onClick={() => onPageChange(safePage - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={safePage === safePages}
                  onClick={() => onPageChange(safePage + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTable;