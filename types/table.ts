import type { DataRow } from './common';

/**
 * Metadata for a single table
 * Stored in IndexedDB as part of 'metadata' key
 */
export interface TableMetadata {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  rowCount: number;
}

/**
 * Data for a single table
 * Stored separately in IndexedDB using table ID
 */
export interface TableData {
  headers: string[];
  data: DataRow[];
  isConfirmed: boolean;
}

/**
 * Complete state of all tables
 * Stored in IndexedDB as 'metadata'
 */
export interface TableListState {
  tables: TableMetadata[];
  activeTableId: string | null;
  version: number; // For future schema migrations
}

/**
 * Combined table metadata with its data
 * Used for UI display and operations
 */
export interface TableState {
  metadata: TableMetadata;
  data: TableData;
}

/**
 * Hook return type for useTableList
 */
export interface UseTableListReturn {
  tables: TableMetadata[];
  activeTableId: string | null;
  isLoading: boolean;
  hasTables: boolean;
  createTable: (name: string) => Promise<string>;
  deleteTable: (tableId: string) => Promise<void>;
  renameTable: (tableId: string, newName: string) => Promise<void>;
  switchTable: (tableId: string) => Promise<void>;
}

/**
 * Hook return type for useTableState
 */
export interface UseTableStateReturn {
  headers: string[];
  data: DataRow[];
  isConfirmed: boolean;
  isLoading: boolean;
  setHeaders: (headers: string[]) => Promise<void>;
  setData: (data: DataRow[]) => Promise<void>;
  setIsConfirmed: (confirmed: boolean) => Promise<void>;
  clearTableData: () => Promise<void>;
}

/**
 * Hook return type for useActiveTable
 */
export interface UseActiveTableReturn {
  // Table list
  tables: TableMetadata[];
  activeTableId: string | null;

  // Table data
  headers: string[];
  data: DataRow[];
  isConfirmed: boolean;

  // Loading states
  isLoading: boolean;
  hasTables: boolean;

  // Table operations
  createTable: (name: string) => Promise<string>;
  deleteTable: (tableId: string) => Promise<void>;
  renameTable: (tableId: string, newName: string) => Promise<void>;
  switchTable: (tableId: string) => Promise<void>;

  // Data operations
  setHeaders: (headers: string[]) => Promise<void>;
  setData: (data: DataRow[]) => Promise<void>;
  setIsConfirmed: (confirmed: boolean) => Promise<void>;
  clearTableData: () => Promise<void>;
}
