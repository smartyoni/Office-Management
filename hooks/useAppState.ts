import { useEffect, useState, useCallback } from 'react';
import { AppState, DataRow } from '../types';
import {
  loadAppState,
  saveHeaders,
  saveData,
  saveIsConfirmed,
} from '../utils/db';

interface UseAppStateReturn {
  headers: string[];
  data: DataRow[] | null;
  isConfirmed: boolean;
  isLoading: boolean;
  setHeaders: (headers: string[]) => Promise<void>;
  setData: (data: DataRow[] | null) => Promise<void>;
  setIsConfirmed: (isConfirmed: boolean) => Promise<void>;
  resetState: () => Promise<void>;
}

/**
 * IndexedDB와 동기화되는 앱 상태 관리 커스텀 훅
 * 상태 변경 시 자동으로 IndexedDB에 저장됨
 */
export const useAppState = (): UseAppStateReturn => {
  const [headers, setHeadersState] = useState<string[]>([]);
  const [data, setDataState] = useState<DataRow[] | null>(null);
  const [isConfirmed, setIsConfirmedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 IndexedDB에서 데이터 로드
  useEffect(() => {
    const loadState = async () => {
      try {
        setIsLoading(true);
        const savedState = await loadAppState();

        if (savedState.headers) {
          setHeadersState(savedState.headers);
        }
        if (savedState.data !== undefined) {
          setDataState(savedState.data);
        }
        if (savedState.isConfirmed !== undefined) {
          setIsConfirmedState(savedState.isConfirmed);
        }
      } catch (error) {
        console.error('Failed to load app state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Headers 저장
  const setHeaders = useCallback(async (newHeaders: string[]) => {
    setHeadersState(newHeaders);
    try {
      await saveHeaders(newHeaders);
    } catch (error) {
      console.error('Failed to save headers:', error);
      throw error;
    }
  }, []);

  // Data 저장
  const setData = useCallback(async (newData: DataRow[] | null) => {
    setDataState(newData);
    try {
      await saveData(newData || []);
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }, []);

  // Confirmation 상태 저장
  const setIsConfirmed = useCallback(async (newIsConfirmed: boolean) => {
    setIsConfirmedState(newIsConfirmed);
    try {
      await saveIsConfirmed(newIsConfirmed);
    } catch (error) {
      console.error('Failed to save isConfirmed state:', error);
      throw error;
    }
  }, []);

  // 전체 상태 초기화
  const resetState = useCallback(async () => {
    setHeadersState([]);
    setDataState(null);
    setIsConfirmedState(false);
    try {
      await saveHeaders([]);
      await saveData([]);
      await saveIsConfirmed(false);
    } catch (error) {
      console.error('Failed to reset state:', error);
      throw error;
    }
  }, []);

  return {
    headers,
    data,
    isConfirmed,
    isLoading,
    setHeaders,
    setData,
    setIsConfirmed,
    resetState,
  };
};
