import { getFromDB, saveToDB, deleteFromDB } from './db';

/**
 * Generate unique table ID
 */
export const generateTableId = (): string => {
  return `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if old single-table format exists
 */
const hasOldFormat = async (): Promise<boolean> => {
  try {
    const headers = await getFromDB('headers');
    const data = await getFromDB('data');
    return headers !== undefined || data !== undefined;
  } catch {
    return false;
  }
};

/**
 * Check if already migrated to new format
 */
const isAlreadyMigrated = async (): Promise<boolean> => {
  try {
    const metadata = await getFromDB('metadata');
    return metadata !== undefined;
  } catch {
    return false;
  }
};

/**
 * Migrate from old single-table format to new multi-table format
 * This function is called on app startup
 */
export const migrateToMultiTable = async (): Promise<void> => {
  try {
    // Check if already migrated
    const alreadyMigrated = await isAlreadyMigrated();
    if (alreadyMigrated) {
      console.log('✓ Already migrated to multi-table format');
      return;
    }

    // Check if old format exists
    const hasOld = await hasOldFormat();
    if (!hasOld) {
      console.log('✓ No data to migrate (fresh start)');
      return;
    }

    console.log('🔄 Starting migration from single-table to multi-table format...');

    // Load old format data
    const oldHeaders = (await getFromDB('headers')) || [];
    const oldData = (await getFromDB('data')) || [];
    const oldConfirmed = (await getFromDB('isConfirmed')) || false;

    // Create default table with current data
    const defaultTableId = generateTableId();
    const now = new Date().toISOString();

    const defaultTable = {
      id: defaultTableId,
      name: '내 데이터',
      createdAt: now,
      updatedAt: now,
      rowCount: Array.isArray(oldData) ? oldData.length : 0,
    };

    // Save new format metadata
    const metadata = {
      tables: [defaultTable],
      activeTableId: defaultTableId,
      version: 2,
    };

    await saveToDB('metadata', metadata);

    // Save table data in new format
    const tableData = {
      headers: Array.isArray(oldHeaders) ? oldHeaders : [],
      data: Array.isArray(oldData) ? oldData : [],
      isConfirmed: oldConfirmed === true,
    };

    await saveToDB(`table:${defaultTableId}:headers`, tableData.headers);
    await saveToDB(`table:${defaultTableId}:data`, tableData.data);
    await saveToDB(`table:${defaultTableId}:confirmed`, tableData.isConfirmed);

    // Clean up old keys
    await deleteFromDB('headers');
    await deleteFromDB('data');
    await deleteFromDB('isConfirmed');

    console.log('✓ Migration completed successfully');
    console.log(`  - Created table: "${defaultTable.name}"`);
    console.log(`  - Rows: ${defaultTable.rowCount}`);
    console.log(`  - Status: ${tableData.isConfirmed ? '확정' : '미확정'}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Get all table metadata
 */
export const getTableMetadata = async () => {
  try {
    const metadata = await getFromDB('metadata');
    if (!metadata) {
      return {
        tables: [],
        activeTableId: null,
        version: 2,
      };
    }
    return metadata;
  } catch (error) {
    console.error('Failed to get table metadata:', error);
    return {
      tables: [],
      activeTableId: null,
      version: 2,
    };
  }
};

/**
 * Save updated table metadata
 */
export const saveTableMetadata = async (metadata: any): Promise<void> => {
  try {
    await saveToDB('metadata', metadata);
  } catch (error) {
    console.error('Failed to save table metadata:', error);
    throw error;
  }
};

/**
 * Get specific table data by ID
 */
export const getTableData = async (tableId: string) => {
  try {
    const headers = (await getFromDB(`table:${tableId}:headers`)) || [];
    const data = (await getFromDB(`table:${tableId}:data`)) || [];
    const isConfirmed = (await getFromDB(`table:${tableId}:confirmed`)) || false;

    return {
      headers,
      data,
      isConfirmed,
    };
  } catch (error) {
    console.error(`Failed to get table data for ${tableId}:`, error);
    return {
      headers: [],
      data: [],
      isConfirmed: false,
    };
  }
};

/**
 * Save table data
 */
export const saveTableData = async (
  tableId: string,
  data: { headers: string[]; data: any[]; isConfirmed: boolean }
): Promise<void> => {
  try {
    await saveToDB(`table:${tableId}:headers`, data.headers);
    await saveToDB(`table:${tableId}:data`, data.data);
    await saveToDB(`table:${tableId}:confirmed`, data.isConfirmed);
  } catch (error) {
    console.error(`Failed to save table data for ${tableId}:`, error);
    throw error;
  }
};

/**
 * Create new table
 */
export const createNewTable = async (name: string) => {
  try {
    const tableId = generateTableId();
    const now = new Date().toISOString();

    const metadata = await getTableMetadata();
    const newTable = {
      id: tableId,
      name,
      createdAt: now,
      updatedAt: now,
      rowCount: 0,
    };

    metadata.tables.push(newTable);
    metadata.activeTableId = tableId;

    await saveTableMetadata(metadata);

    // Initialize empty table data
    await saveTableData(tableId, {
      headers: [],
      data: [],
      isConfirmed: false,
    });

    return {
      tableId,
      table: newTable,
    };
  } catch (error) {
    console.error('Failed to create new table:', error);
    throw error;
  }
};

/**
 * Delete table
 */
export const deleteTable = async (tableId: string): Promise<void> => {
  try {
    const metadata = await getTableMetadata();
    const updatedTables = metadata.tables.filter((t: any) => t.id !== tableId);

    // If deleting active table, switch to first available
    let newActiveId = metadata.activeTableId;
    if (metadata.activeTableId === tableId) {
      newActiveId = updatedTables.length > 0 ? updatedTables[0].id : null;
    }

    metadata.tables = updatedTables;
    metadata.activeTableId = newActiveId;

    await saveTableMetadata(metadata);

    // Delete table data
    await deleteFromDB(`table:${tableId}:headers`);
    await deleteFromDB(`table:${tableId}:data`);
    await deleteFromDB(`table:${tableId}:confirmed`);

    console.log(`✓ Table "${tableId}" deleted`);
  } catch (error) {
    console.error(`Failed to delete table ${tableId}:`, error);
    throw error;
  }
};

/**
 * Rename table
 */
export const renameTable = async (tableId: string, newName: string): Promise<void> => {
  try {
    const metadata = await getTableMetadata();
    const tableIndex = metadata.tables.findIndex((t: any) => t.id === tableId);

    if (tableIndex === -1) {
      throw new Error(`Table ${tableId} not found`);
    }

    metadata.tables[tableIndex].name = newName;
    metadata.tables[tableIndex].updatedAt = new Date().toISOString();

    await saveTableMetadata(metadata);
    console.log(`✓ Table renamed to "${newName}"`);
  } catch (error) {
    console.error(`Failed to rename table ${tableId}:`, error);
    throw error;
  }
};

/**
 * Set active table
 */
export const setActiveTable = async (tableId: string): Promise<void> => {
  try {
    const metadata = await getTableMetadata();

    // Verify table exists
    const tableExists = metadata.tables.some((t: any) => t.id === tableId);
    if (!tableExists) {
      throw new Error(`Table ${tableId} not found`);
    }

    metadata.activeTableId = tableId;
    await saveTableMetadata(metadata);
  } catch (error) {
    console.error(`Failed to set active table ${tableId}:`, error);
    throw error;
  }
};

/**
 * Update table row count
 */
export const updateTableRowCount = async (tableId: string, rowCount: number): Promise<void> => {
  try {
    const metadata = await getTableMetadata();
    const tableIndex = metadata.tables.findIndex((t: any) => t.id === tableId);

    if (tableIndex === -1) {
      throw new Error(`Table ${tableId} not found`);
    }

    metadata.tables[tableIndex].rowCount = rowCount;
    metadata.tables[tableIndex].updatedAt = new Date().toISOString();

    await saveTableMetadata(metadata);
  } catch (error) {
    console.error(`Failed to update row count for ${tableId}:`, error);
    throw error;
  }
};

/**
 * Rename table "계약호실관리" to "계약호실"
 * This function is called on app startup to handle existing data migration
 */
export const renameExistingTable = async (): Promise<void> => {
  try {
    const metadata = await getTableMetadata();

    // Find table with name "계약호실관리"
    const tableIndex = metadata.tables.findIndex((t: any) => t.name === '계약호실관리');

    if (tableIndex !== -1) {
      metadata.tables[tableIndex].name = '계약호실';
      metadata.tables[tableIndex].updatedAt = new Date().toISOString();

      await saveTableMetadata(metadata);
      console.log('✓ Table renamed from "계약호실관리" to "계약호실"');
    }
  } catch (error) {
    console.error('Failed to rename table:', error);
    throw error;
  }
};
