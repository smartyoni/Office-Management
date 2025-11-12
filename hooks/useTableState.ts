import { useState, useEffect, useCallback } from 'react';
import { getTableData, saveTableData, updateTableRowCount } from '../utils/dbMigration';
import type { DataRow, UseTableStateReturn } from '../types';

/**
 * Hook for managing state of a specific table
 * Handles: load, save, update headers, data, confirmation
 * Used by useActiveTable hook
 */
export const useTableState = (tableId: string | null): UseTableStateReturn => {
  const [headers, setHeadersState] = useState<string[]>([]);
  const [data, setDataState] = useState<DataRow[]>([]);
  const [isConfirmed, setIsConfirmedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load table data when tableId changes
  useEffect(() => {
    const loadTableData = async () => {
      if (!tableId) {
        // Reset state if no table selected
        setHeadersState([]);
        setDataState([]);
        setIsConfirmedState(false);
        return;
      }

      try {
        setIsLoading(true);
        const tableData = await getTableData(tableId);
        setHeadersState(tableData.headers);
        setDataState(tableData.data);
        setIsConfirmedState(tableData.isConfirmed);
      } catch (error) {
        console.error(`Failed to load table state for ${tableId}:`, error);
        setHeadersState([]);
        setDataState([]);
        setIsConfirmedState(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadTableData();
  }, [tableId]);

  // Update headers and save to DB
  const setHeaders = useCallback(
    async (newHeaders: string[]) => {
      setHeadersState(newHeaders);
      if (!tableId) return;

      try {
        await saveTableData(tableId, {
          headers: newHeaders,
          data,
          isConfirmed,
        });
      } catch (error) {
        console.error('Failed to save headers:', error);
        throw error;
      }
    },
    [tableId, data, isConfirmed]
  );

  // Update data and save to DB
  const setData = useCallback(
    async (newData: DataRow[]) => {
      setDataState(newData);
      if (!tableId) return;

      try {
        // Update row count in metadata
        await updateTableRowCount(tableId, newData.length);

        // Save data to DB
        await saveTableData(tableId, {
          headers,
          data: newData,
          isConfirmed,
        });
      } catch (error) {
        console.error('Failed to save data:', error);
        throw error;
      }
    },
    [tableId, headers, isConfirmed]
  );

  // Update confirmation state and save to DB
  const setIsConfirmed = useCallback(
    async (newConfirmed: boolean) => {
      setIsConfirmedState(newConfirmed);
      if (!tableId) return;

      try {
        await saveTableData(tableId, {
          headers,
          data,
          isConfirmed: newConfirmed,
        });
      } catch (error) {
        console.error('Failed to save confirmation state:', error);
        throw error;
      }
    },
    [tableId, headers, data]
  );

  // Clear all table data (called when deleting table or switching tables)
  const clearTableData = useCallback(async () => {
    setHeadersState([]);
    setDataState([]);
    setIsConfirmedState(false);
  }, []);

  return {
    headers,
    data,
    isConfirmed,
    isLoading,
    setHeaders,
    setData,
    setIsConfirmed,
    clearTableData,
  };
};
