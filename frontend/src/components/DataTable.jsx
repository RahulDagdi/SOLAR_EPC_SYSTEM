import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, RotateCcw, ChevronLeft, ChevronRight, Filter, Download, CheckSquare, Square } from 'lucide-react';
import DeleteConfirm from './DeleteConfirm';

const DataTable = ({
  title,
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSearch,
  onAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  onRestore,
  showRestore = false,
  deletedData = [],
  onRefresh,
  searchPlaceholder = "Search...",
  addButtonLabel = "Add New",
  showActions = true,
  showBulkDelete = true,
  filterOptions = null,
  onFilterChange = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, bulk: false });
  const [showDeleted, setShowDeleted] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(item => item._id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, id, bulk: false });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({ open: true, id: null, bulk: true });
  };

  const confirmDelete = () => {
    if (deleteModal.bulk) {
      onBulkDelete?.(selectedIds);
      setSelectedIds([]);
    } else {
      onDelete?.(deleteModal.id);
    }
    setDeleteModal({ open: false, id: null, bulk: false });
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
    onFilterChange?.(value);
  };

  const renderCell = (item, column) => {
    const value = column.accessor.includes('.')
      ? column.accessor.split('.').reduce((obj, key) => obj?.[key], item)
      : item[column.accessor];

    if (column.format) {
      return column.format(value, item);
    }

    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    if (column.type === 'currency' && value !== undefined) {
      return `₹${Number(value).toLocaleString('en-IN')}`;
    }

    if (column.type === 'badge' && value) {
      const colors = {
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-gray-100 text-gray-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Completed': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Not Started': 'bg-gray-100 text-gray-800',
        'Paid': 'bg-green-100 text-green-800',
        'Overdue': 'bg-red-100 text-red-800',
        'Draft': 'bg-gray-100 text-gray-800',
        'Sent': 'bg-blue-100 text-blue-800',
        'Present': 'bg-green-100 text-green-800',
        'Absent': 'bg-red-100 text-red-800',
        'Late': 'bg-yellow-100 text-yellow-800',
        'Leave': 'bg-purple-100 text-purple-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      );
    }

    return value || '-';
  };

  const displayData = showDeleted ? deletedData : data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="page-title">{title}</h2>
        <div className="flex items-center gap-3">
          {showRestore && (
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`btn-secondary text-sm ${showDeleted ? 'bg-yellow-50 text-yellow-700' : ''}`}
            >
              <RotateCcw className="w-4 h-4" />
              {showDeleted ? 'Show Active' : 'Show Deleted'}
            </button>
          )}
          {onAdd && !showDeleted && (
            <button onClick={onAdd} className="btn-primary text-sm">
              <Plus className="w-4 h-4" />
              {addButtonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        {filterOptions && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterValue}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="input-field pl-10 min-w-[150px]"
            >
              <option value="">All</option>
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
        {showBulkDelete && selectedIds.length > 0 && !showDeleted && (
          <button onClick={handleBulkDelete} className="btn-danger text-sm">
            <Trash2 className="w-4 h-4" />
            Delete ({selectedIds.length})
          </button>
        )}
        {onRefresh && (
          <button onClick={onRefresh} className="btn-secondary text-sm">
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {showBulkDelete && !showDeleted && (
                  <th className="table-header w-10">
                    <button onClick={handleSelectAll} className="p-1">
                      {selectedIds.length === data.length && data.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.accessor} className="table-header" style={{ width: col.width }}>
                    {col.header}
                  </th>
                ))}
                {showActions && !showDeleted && (
                  <th className="table-header text-right">Actions</th>
                )}
                {showDeleted && showRestore && (
                  <th className="table-header text-right">Restore</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (showActions || showRestore ? 2 : 1)} className="table-cell text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : displayData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (showActions || showRestore ? 2 : 1)} className="table-cell text-center py-8 text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                displayData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    {showBulkDelete && !showDeleted && (
                      <td className="table-cell">
                        <button onClick={() => handleSelectRow(item._id)} className="p-1">
                          {selectedIds.includes(item._id) ? (
                            <CheckSquare className="w-4 h-4 text-primary-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.accessor} className="table-cell">
                        {renderCell(item, col)}
                      </td>
                    ))}
                    {showActions && !showDeleted && (
                      <td className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                    {showDeleted && showRestore && (
                      <td className="table-cell text-right">
                        <button
                          onClick={() => onRestore?.(item._id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirm
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, bulk: false })}
        onConfirm={confirmDelete}
        isBulk={deleteModal.bulk}
        count={deleteModal.bulk ? selectedIds.length : 1}
      />
    </div>
  );
};

export default DataTable;
