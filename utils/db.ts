import { AppState, DataRow } from '../types';

const DB_NAME = 'csv-data-manager-db';
const DB_VERSION = 1;
const STORE_NAME = 'appState';

export interface IndexedDBStore {
  id: string;
  value: any;
}

let dbInstance: IDBDatabase | null = null;

/**
 * IndexedDB 데이터베이스 초기화
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;

      // 데이터베이스 초기화 후 자동 마이그레이션 실행
      // (비동기이므로 await 불필요)
      import('./dbMigration').then(({ migrateToMultiTable }) => {
        migrateToMultiTable().catch(error => {
          console.error('Auto-migration on DB init failed:', error);
        });
      });

      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Object Store 생성
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * 특정 키로 데이터 조회
 */
export const getFromDB = async (key: string): Promise<any> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => {
      reject(new Error(`Failed to get data from DB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result?.value);
    };
  });
};

/**
 * 데이터 저장 (없으면 생성, 있으면 업데이트)
 */
export const saveToDB = async (key: string, value: any): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id: key, value });

    request.onerror = () => {
      reject(new Error(`Failed to save data to DB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
};

/**
 * 특정 키 데이터 삭제
 */
export const deleteFromDB = async (key: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onerror = () => {
      reject(new Error(`Failed to delete data from DB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
};

/**
 * 모든 데이터 조회
 */
export const getAllFromDB = async (): Promise<IndexedDBStore[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      reject(new Error(`Failed to get all data from DB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

/**
 * 데이터베이스 전체 초기화
 */
export const clearDB = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => {
      reject(new Error(`Failed to clear DB: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
};

/**
 * 앱 상태 전체 로드
 */
export const loadAppState = async (): Promise<Partial<AppState>> => {
  try {
    const headers = (await getFromDB('headers')) || [];
    const data = (await getFromDB('data')) || null;
    const isConfirmed = (await getFromDB('isConfirmed')) || false;

    return { headers, data, isConfirmed };
  } catch (error) {
    console.error('Failed to load app state from DB:', error);
    return {};
  }
};

/**
 * 앱 상태 전체 저장
 */
export const saveAppState = async (state: AppState): Promise<void> => {
  try {
    await Promise.all([
      saveToDB('headers', state.headers),
      saveToDB('data', state.data),
      saveToDB('isConfirmed', state.isConfirmed),
    ]);
  } catch (error) {
    console.error('Failed to save app state to DB:', error);
    throw error;
  }
};

/**
 * 특정 데이터 저장
 */
export const saveHeaders = async (headers: string[]): Promise<void> => {
  await saveToDB('headers', headers);
};

export const saveData = async (data: DataRow[]): Promise<void> => {
  await saveToDB('data', data);
};

export const saveIsConfirmed = async (isConfirmed: boolean): Promise<void> => {
  await saveToDB('isConfirmed', isConfirmed);
};

/**
 * 다중 테이블 지원 함수들
 * dbMigration.ts에서 직접 사용됨
 */

export const getMultiTableData = async (tableId: string) => {
  try {
    const headers = (await getFromDB(`table:${tableId}:headers`)) || [];
    const data = (await getFromDB(`table:${tableId}:data`)) || [];
    const isConfirmed = (await getFromDB(`table:${tableId}:confirmed`)) || false;

    return { headers, data, isConfirmed };
  } catch (error) {
    console.error(`Failed to get multi-table data for ${tableId}:`, error);
    return { headers: [], data: [], isConfirmed: false };
  }
};

export const saveMultiTableData = async (
  tableId: string,
  headers: string[],
  data: DataRow[],
  isConfirmed: boolean
): Promise<void> => {
  try {
    await saveToDB(`table:${tableId}:headers`, headers);
    await saveToDB(`table:${tableId}:data`, data);
    await saveToDB(`table:${tableId}:confirmed`, isConfirmed);
  } catch (error) {
    console.error(`Failed to save multi-table data for ${tableId}:`, error);
    throw error;
  }
};
