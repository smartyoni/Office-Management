import { useState, useEffect, useCallback } from 'react';
import {
  getTableMetadata,
  saveTableMetadata,
  createNewTable,
  deleteTable as deleteTableUtil,
  renameTable as renameTableUtil,
  setActiveTable as setActiveTableUtil,
} from '../utils/dbMigration';
import type { TableMetadata, UseTableListReturn } from '../types';

/**
 * Hook for managing table list and table metadata operations
 * Handles: create, delete, rename, switch tables
 */
export const useTableList = (): UseTableListReturn => {
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load table list on mount
  useEffect(() => {
    const loadTableList = async () => {
      try {
        setIsLoading(true);
        const metadata = await getTableMetadata();
        setTables(metadata.tables || []);
        setActiveTableId(metadata.activeTableId || null);
      } catch (error) {
        console.error('Failed to load table list:', error);
        setTables([]);
        setActiveTableId(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadTableList();
  }, []);

  // Create new table
  const createTable = useCallback(
    async (name: string): Promise<string> => {
      try {
        const result = await createNewTable(name);
        // Update local state
        setTables(prev => [...prev, result.table]);
        setActiveTableId(result.tableId);
        return result.tableId;
      } catch (error) {
        console.error('Failed to create table:', error);
        throw error;
      }
    },
    []
  );

  // Delete table
  const deleteTable = useCallback(async (tableId: string): Promise<void> => {
    try {
      // Delete from DB
      await deleteTableUtil(tableId);

      // Update local state
      const updatedTables = tables.filter(t => t.id !== tableId);
      setTables(updatedTables);

      // If deleting active table, switch to first available
      if (activeTableId === tableId) {
        const newActiveId = updatedTables.length > 0 ? updatedTables[0].id : null;
        setActiveTableId(newActiveId);
      }
    } catch (error) {
      console.error(`Failed to delete table ${tableId}:`, error);
      throw error;
    }
  }, [tables, activeTableId]);

  // Rename table
  const renameTable = useCallback(
    async (tableId: string, newName: string): Promise<void> => {
      try {
        await renameTableUtil(tableId, newName);

        // Update local state
        setTables(prev =>
          prev.map(t =>
            t.id === tableId
              ? { ...t, name: newName, updatedAt: new Date().toISOString() }
              : t
          )
        );
      } catch (error) {
        console.error(`Failed to rename table ${tableId}:`, error);
        throw error;
      }
    },
    []
  );

  // Switch active table
  const switchTable = useCallback(async (tableId: string): Promise<void> => {
    try {
      // Verify table exists
      const tableExists = tables.some(t => t.id === tableId);
      if (!tableExists) {
        throw new Error(`Table ${tableId} not found`);
      }

      await setActiveTableUtil(tableId);
      setActiveTableId(tableId);
    } catch (error) {
      console.error(`Failed to switch to table ${tableId}:`, error);
      throw error;
    }
  }, [tables]);

  return {
    tables,
    activeTableId,
    isLoading,
    hasTables: tables.length > 0,
    createTable,
    deleteTable,
    renameTable,
    switchTable,
  };
};
