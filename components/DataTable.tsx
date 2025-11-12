import React, { useState, useMemo } from 'react';
import { DataRow } from '../types';
import Icon from './Icon';

interface DataTableProps {
  headers: string[];
  data: DataRow[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onReset: () => void;
  onView: (index: number) => void;
  onAppend: () => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  isConfirmed: boolean;
  onConfirm: () => void;
  onUnconfirm: () => void;
  tableName?: string;
}

const ROWS_PER_PAGE = 50;

const DataTable: React.FC<DataTableProps> = ({ headers, data, onAdd, onEdit, onDelete, onReset, onView, onAppend, errorMessage, setErrorMessage, isConfirmed, onConfirm, onUnconfirm, tableName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Update current date and time on mount and every minute
  React.useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      setCurrentDateTime(`${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  const [columnOrder, setColumnOrder] = useState<string[]>(headers);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; column: string } | null>(null);
  const [deletedColumns, setDeletedColumns] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [showHiddenColumnsModal, setShowHiddenColumnsModal] = useState(false);

  // Load column order, deleted columns, and column widths from localStorage on mount
  React.useEffect(() => {
    const savedOrder = localStorage.getItem('columnOrder');
    const savedDeleted = localStorage.getItem('deletedColumns');
    const savedWidths = localStorage.getItem('columnWidths');

    if (savedDeleted) {
      try {
        const parsed = JSON.parse(savedDeleted);
        if (Array.isArray(parsed)) {
          setDeletedColumns(parsed);
        }
      } catch (e) {
        // Invalid saved deleted columns
      }
    }

    if (savedWidths) {
      try {
        const parsed = JSON.parse(savedWidths);
        if (typeof parsed === 'object' && parsed !== null) {
          setColumnWidths(parsed);
        }
      } catch (e) {
        // Invalid saved widths
      }
    }

    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        // Only use saved order if all headers are present
        if (Array.isArray(parsed) && parsed.length === headers.length &&
            parsed.every(col => headers.includes(col))) {
          setColumnOrder(parsed);
          return;
        }
      } catch (e) {
        // Invalid saved order, use default
      }
    }
    setColumnOrder(headers);
  }, [headers]);

  // Save column order to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
  }, [columnOrder]);

  // Save deleted columns to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('deletedColumns', JSON.stringify(deletedColumns));
  }, [deletedColumns]);

  // Save column widths to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('columnWidths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Get visible columns (exclude deleted ones)
  const visibleColumns = useMemo(() => {
    return columnOrder.filter(col => !deletedColumns.includes(col));
  }, [columnOrder, deletedColumns]);

  // Filter data based on search query (only search in visible columns)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((row) => {
      return visibleColumns.some((header) => {
        const cellValue = String(row[header] || '').toLowerCase();
        return cellValue.includes(lowerQuery);
      });
    });
  }, [data, searchQuery, visibleColumns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    let dataToSort = [...filteredData];

    // If a specific column is selected for sorting
    if (sortColumn) {
      dataToSort.sort((a, b) => {
        const aVal = String(a[sortColumn] || '');
        const bVal = String(b[sortColumn] || '');

        // Try numeric comparison first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Fall back to string comparison
        const comparison = aVal.localeCompare(bVal, 'ko-KR');
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return dataToSort;
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * ROWS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const totalRows = filteredData.length;
  const displayingRows = paginatedData.length;

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleSort = (column: string) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and reset to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(0); // Reset to first page on sort
  };

  const getSortIndicator = (column: string) => {
    // If a sort column is selected
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' ↑' : ' ↓';
    }
    // Default neutral indicator
    return ' ↕';
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, column: string) => {
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, column: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetColumn: string) => {
    e.preventDefault();

    if (!draggedColumn || draggedColumn === targetColumn) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = columnOrder.indexOf(draggedColumn);
    const targetIndex = columnOrder.indexOf(targetColumn);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const newColumnOrder = [...columnOrder];
    const [draggedCol] = newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedCol);

    setColumnOrder(newColumnOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>, column: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      column
    });
  };

  const handleDeleteColumn = () => {
    if (contextMenu) {
      setDeletedColumns([...deletedColumns, contextMenu.column]);
      setContextMenu(null);
    }
  };

  const handleUndoDelete = (column: string) => {
    setDeletedColumns(deletedColumns.filter(col => col !== column));
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle column resize
  const handleMouseDown = (e: React.MouseEvent, column: string) => {
    e.preventDefault();
    setResizingColumn(column);
  };

  React.useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      setColumnWidths(prev => ({
        ...prev,
        [resizingColumn]: Math.max(60, (prev[resizingColumn] || 160) + e.movementX)
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full bg-white">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">{tableName}</h1>
          <p className="mt-1 text-sm font-bold text-red-600">{currentDateTime}</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center space-x-3">
          {!isConfirmed ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto transition-colors"
            >
              새 파일 업로드
            </button>
          ) : null}
          <button
            type="button"
            onClick={isConfirmed ? onUnconfirm : onConfirm}
            className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto transition-colors ${
              isConfirmed
                ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500'
            }`}
          >
            {isConfirmed ? '확정 해제' : '확정'}
          </button>
          {deletedColumns.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHiddenColumnsModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto transition-colors"
            >
              숨겨둔 컬럼 ({deletedColumns.length})
            </button>
          )}
          <button
            type="button"
            onClick={onAppend}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto transition-colors"
          >
            <Icon name="upload" className="w-5 h-5 mr-2 -ml-1"/>
            CSV 추가하기
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto transition-colors"
          >
            <Icon name="add" className="w-5 h-5 mr-2 -ml-1"/>
            행 추가
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md relative mb-4" role="alert">
            <strong className="font-bold">오류: </strong>
            <span className="block sm:inline">{errorMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage('')}>
                <Icon name="close" className="w-5 h-5 text-red-400 hover:text-red-200 cursor-pointer"/>
            </span>
        </div>
      )}

      {/* Search and Filter Section with Pagination */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-128">
            <div className="relative">
              <Icon name="search" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="모든 열에서 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="text-sm text-gray-700">
            {totalRows > 0 ? (
              <span>{displayingRows}개 / {totalRows}개 보기</span>
            ) : (
              <span>검색 결과 없음</span>
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <div className="text-sm text-black font-bold whitespace-nowrap">
              페이지 {currentPage + 1} / {totalPages}
            </div>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="px-3 py-2 bg-gray-200 border border-gray-400 rounded-lg text-black font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="chevron_left" className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 bg-gray-200 border border-gray-400 rounded-lg text-black font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="chevron_right" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-10 rounded-lg">
        <table className="divide-y divide-gray-300" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            {visibleColumns.map((header) => (
              <col key={`col-${header}`} style={{ width: `${columnWidths[header] || 160}px` }} />
            ))}
            <col style={{ width: 'auto' }} />
          </colgroup>
          <thead className="bg-green-800/60">
            <tr>
              {visibleColumns.map((header) => (
                <th
                  key={header}
                  scope="col"
                  draggable
                  onDragStart={(e) => handleDragStart(e, header)}
                  onDragOver={(e) => handleDragOver(e, header)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, header)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSort(header)}
                  onContextMenu={(e) => handleContextMenu(e, header)}
                  className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-green-50 sm:pl-6 capitalize overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-green-900/60 transition-colors relative ${
                    draggedColumn === header ? 'opacity-50 bg-green-900/40' : ''
                  } ${dragOverColumn === header ? 'border-l-4 border-blue-400' : ''}`}
                  title="클릭하여 정렬 / 드래그하여 순서 변경 / 우클릭하여 삭제 / 오른쪽 경계 드래그로 너비 조정"
                  style={{
                    borderLeft: dragOverColumn === header ? '4px solid #60A5FA' : undefined,
                    opacity: draggedColumn === header ? 0.5 : 1,
                    backgroundColor: draggedColumn === header ? 'rgba(5, 150, 105, 0.4)' : undefined,
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{header}{getSortIndicator(header)}</span>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, header)}
                      style={{
                        width: '6px',
                        height: '100%',
                        cursor: 'col-resize',
                        marginLeft: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="드래그하여 컬럼 너비 조정"
                    >
                      <div style={{
                        width: '2px',
                        height: '70%',
                        backgroundColor: resizingColumn === header ? '#ffffff' : '#9ca3af',
                        borderRadius: '1px'
                      }} />
                    </div>
                  </div>
                </th>
              ))}
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                <span className="text-sm font-semibold text-green-50">작업</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {paginatedData.map((row, displayIndex) => {
              // Find the actual index in the original filtered data
              const actualIndex = (currentPage * ROWS_PER_PAGE) + displayIndex;
              const originalIndex = data.indexOf(row);

              return (
                <tr key={`${actualIndex}-${originalIndex}`} onClick={() => onView(originalIndex)} className="transition-colors cursor-pointer" style={{
                  backgroundColor: displayIndex % 2 === 0 ? '#F0F4FF' : '#F3F4F6'
                }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E8E8F0')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = displayIndex % 2 === 0 ? '#F0F4FF' : '#F3F4F6')}>
                  {visibleColumns.map((header, cellIndex) => {
                    const isPhoneColumn = header.toLowerCase().includes('전화') ||
                                          header.toLowerCase().includes('휴대폰') ||
                                          header.toLowerCase().includes('핸드폰') ||
                                          header.toLowerCase().includes('번호') ||
                                          header.toLowerCase().includes('phone') ||
                                          header.toLowerCase().includes('tel') ||
                                          header.toLowerCase().includes('mobile');
                    const phoneValue = isPhoneColumn ? String(row[header] || '').replace(/[^0-9]/g, '') : '';

                    return (
                      <td key={`${actualIndex}-${cellIndex}`} className="py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6 overflow-hidden text-ellipsis whitespace-nowrap">
                        {isPhoneColumn && phoneValue ? (
                          <a
                            href={`sms:${phoneValue}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: '#3B82F6',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1D4ED8')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#3B82F6')}
                          >
                            {row[header]}
                          </a>
                        ) : (
                          row[header]
                        )}
                      </td>
                    );
                  })}
                  <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end items-center space-x-4">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(originalIndex); }} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                          <Icon name="edit" className="w-5 h-5"/>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(originalIndex); }} className="text-red-500 hover:text-red-400 transition-colors">
                          <Icon name="delete" className="w-5 h-5"/>
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
             {filteredData.length === 0 && (
                <tr>
                    <td colSpan={visibleColumns.length + 1} className="text-center py-10 text-gray-500 font-bold">
                        {searchQuery.trim() ? '검색 결과가 없습니다.' : '데이터가 없습니다. 새 레코드를 추가하여 시작하세요.'}
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>


      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: '180px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDeleteColumn}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#ef4444',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            컬럼 숨기기
          </button>
        </div>
      )}

      {/* Undo Bar for Deleted Columns */}
      {deletedColumns.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#374151',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '90%'
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.875rem' }}>
              {deletedColumns.length > 1
                ? `${deletedColumns.length}개 컬럼이 삭제되었습니다.`
                : `'${deletedColumns[deletedColumns.length - 1]}' 컬럼이 삭제되었습니다.`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {deletedColumns.map((col) => (
              <button
                key={col}
                onClick={() => handleUndoDelete(col)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
              >
                취소: {col}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Columns Modal */}
      {showHiddenColumnsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => setShowHiddenColumnsModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">숨겨둔 컬럼</h3>
              <button
                type="button"
                onClick={() => setShowHiddenColumnsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
              {deletedColumns.length === 0 ? (
                <p className="text-gray-500 text-center py-4">숨겨둔 컬럼이 없습니다.</p>
              ) : (
                deletedColumns.map((col) => (
                  <div
                    key={col}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700 font-medium">{col}</span>
                    <button
                      type="button"
                      onClick={() => handleUndoDelete(col)}
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      복원
                    </button>
                  </div>
                ))
              )}
            </div>
            {deletedColumns.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeletedColumns([]);
                    setShowHiddenColumnsModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                  모두 복원
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;