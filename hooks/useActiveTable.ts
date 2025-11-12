import { useTableList } from './useTableList';
import { useTableState } from './useTableState';
import type { UseActiveTableReturn } from '../types';

/**
 * Composite hook that combines useTableList and useTableState
 * Provides access to:
 * - Table list management (create, delete, rename, switch)
 * - Current table data (headers, data, confirmed state)
 * - All operations needed for multi-table functionality
 */
export const useActiveTable = (): UseActiveTableReturn => {
  // Table list management
  const {
    tables,
    activeTableId,
    isLoading: tableListLoading,
    hasTables,
    createTable,
    deleteTable,
    renameTable,
    switchTable,
  } = useTableList();

  // Current table data management
  const {
    headers,
    data,
    isConfirmed,
    isLoading: tableStateLoading,
    setHeaders,
    setData,
    setIsConfirmed,
    clearTableData,
  } = useTableState(activeTableId);

  return {
    // Table list
    tables,
    activeTableId,

    // Table data
    headers,
    data,
    isConfirmed,

    // Loading states
    isLoading: tableListLoading || tableStateLoading,
    hasTables,

    // Table operations
    createTable,
    deleteTable,
    renameTable,
    switchTable,

    // Data operations
    setHeaders,
    setData,
    setIsConfirmed,
    clearTableData,
  };
};
