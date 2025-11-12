import React, { useState } from 'react';
import Icon from '../Icon';
import type { TableMetadata } from '../../types';

interface TableSelectorProps {
  tables: TableMetadata[];
  activeTableId: string | null;
  onSelectTable: (tableId: string) => void;
  onCreateTable: () => void;
  onDeleteTable: (tableId: string) => void;
  onRenameTable: (tableId: string) => void;
}

/**
 * Tab-based table navigation component
 * Displays: table tabs, create button, table settings dropdown
 */
export const TableSelector: React.FC<TableSelectorProps> = ({
  tables,
  activeTableId,
  onSelectTable,
  onCreateTable,
  onDeleteTable,
  onRenameTable,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownTableId, setDropdownTableId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation();
    if (window.confirm('이 테이블을 삭제하시겠습니까?')) {
      onDeleteTable(tableId);
      setShowDropdown(false);
    }
  };

  const handleRenameClick = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation();
    onRenameTable(tableId);
    setShowDropdown(false);
  };

  return (
    <div style={{ borderBottom: '1px solid #4B5563', backgroundColor: '#6B46C1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {/* Table Tabs */}
        {tables.map(table => (
          <div key={table.id} className="relative">
            <button
              onClick={() => {
                onSelectTable(table.id);
                setShowDropdown(false);
              }}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                transition-all duration-200
                relative group
                ${activeTableId === table.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              {table.name}

              {/* Active indicator */}
              {activeTableId === table.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            {/* Table Options Dropdown */}
            {activeTableId === table.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                  setDropdownTableId(table.id);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="more" className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            )}

            {/* Dropdown Menu */}
            {showDropdown && dropdownTableId === table.id && (
              <div className="absolute top-full mt-1 right-0 w-40 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-20">
                <button
                  onClick={(e) => handleRenameClick(e, table.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 first:rounded-t-lg transition-colors flex items-center space-x-2"
                >
                  <Icon name="edit" className="w-4 h-4" />
                  <span>이름 변경</span>
                </button>

                <button
                  onClick={(e) => handleDeleteClick(e, table.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 last:rounded-b-lg transition-colors flex items-center space-x-2"
                >
                  <Icon name="delete" className="w-4 h-4" />
                  <span>삭제</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Create New Table Button */}
        <button
          onClick={onCreateTable}
          className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors ml-2"
          title="새 테이블 추가"
        >
          <Icon name="add" className="w-5 h-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default TableSelector;
