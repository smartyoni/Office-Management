import React, { useEffect } from 'react';
import TableManager from './components/tables/TableManager';
import { migrateToMultiTable, renameExistingTable } from './utils/dbMigration';

/**
 * Main App Component
 *
 * Simplified orchestration - all business logic moved to:
 * - TableManager component (UI orchestration)
 * - useActiveTable hook (state management)
 * - dbMigration utilities (data persistence)
 */
function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Run migrations on app startup
        await migrateToMultiTable();
        await renameExistingTable();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return <TableManager />;
}

export default App;
