/**
 * Common data types used throughout the application
 */

/**
 * Single row of data in a table
 * Keys are column names, values are cell contents
 */
export type DataRow = Record<string, string | number>;

/**
 * Application state for single table (legacy, kept for backwards compatibility)
 * Used by useAppState hook
 */
export interface AppState {
  headers: string[];
  data: DataRow[];
  isConfirmed: boolean;
}
