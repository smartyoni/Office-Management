import React, { useState } from 'react';
import { useActiveTable } from '../../hooks/useActiveTable';
import TableSelector from './TableSelector';
import CreateTableModal from './CreateTableModal';
import RenameTableModal from './RenameTableModal';
import FileUpload from '../FileUpload';
import DataTable from '../DataTable';
import Modal from '../Modal';
import DetailModal from '../DetailModal';
import FilterSidebar from '../filters/FilterSidebar';
import type { DataRow } from '../../types';

/**
 * Main container component for multi-table functionality
 * Orchestrates:
 * - Table selection and navigation
 * - Table creation and management
 * - Data display and editing
 * - Modal interactions
 */
interface OpenModal {
  id: string;
  data: DataRow;
  rowIndex: number;
  position: {x: number, y: number};
  zIndex: number;
}

export const TableManager: React.FC = () => {
  const appState = useActiveTable();

  // Modal states
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [showRenameTable, setShowRenameTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [openModals, setOpenModals] = useState<OpenModal[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter state
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [contractFilter, setContractFilter] = useState<string | null>(null);

  // Helper function to parse dates
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const formats = [
      /^(\d{4})-(\d{2})-(\d{2})$/,
      /^(\d{4})\/(\d{2})\/(\d{2})$/,
      /^(\d{4})(\d{2})(\d{2})$/,
    ];
    for (const format of formats) {
      const match = dateStr.trim().match(format);
      if (match) {
        const [, year, month, day] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    return null;
  };

  // Filter function for contract table
  const applyContractFilter = (data: DataRow[], filter: string | null): DataRow[] => {
    if (!filter) return data;

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    return data.filter(row => {
      if (filter === 'monthly_contract') {
        const contractDate = row['계약서작성일'];
        if (!contractDate) return false;
        const date = parseDate(contractDate);
        return date && date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      } else if (filter === 'monthly_payment') {
        const paymentDate = row['잔금일'];
        if (!paymentDate) return false;
        const date = parseDate(paymentDate);
        return date && date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      } else if (filter === 'scheduled_contract') {
        const contractDate = row['계약서작성일'];
        if (!contractDate) return false;
        const date = parseDate(contractDate);
        if (!date) return false;
        const nextMonth = new Date(currentYear, currentMonth, 1);
        return date > nextMonth;
      }
      return true;
    });
  };

  // CSV parsing logic (moved from App.tsx)
  const parseCSV = (csvText: string) => {
    try {
      const lines = csvText.trim().replace(/\r\n/g, '\n').split('\n');
      if (lines.length < 1 || lines[0].trim() === '') {
        setErrorMessage('CSV 파일이 비어 있거나 헤더가 없습니다.');
        return { headers: [], data: [] };
      }

      const parseCsvLine = (line: string): string[] => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (inQuotes) {
            if (char === '"') {
              if (i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = false;
              }
            } else {
              current += char;
            }
          } else {
            if (char === '"') {
              inQuotes = true;
            } else if (char === ',') {
              values.push(current);
              current = '';
            } else {
              current += char;
            }
          }
        }
        values.push(current);
        return values;
      };

      const parsedHeaders = parseCsvLine(lines[0]);

      const parsedData = lines
        .slice(1)
        .filter(line => line.trim() !== '')
        .map(line => {
          const values = parseCsvLine(line);
          if (values.length !== parsedHeaders.length) {
            console.warn(
              `Skipping malformed row: number of columns (${values.length}) does not match header (${parsedHeaders.length}). Line: "${line}"`
            );
            return null;
          }
          return parsedHeaders.reduce((obj, header, index) => {
            obj[header] = values[index] ?? '';
            return obj;
          }, {} as DataRow);
        })
        .filter((row): row is DataRow => {
          if (row === null) return false;
          // 모든 필드가 빈 문자열인 행 제외
          const hasValue = Object.values(row).some(value => {
            const trimmedValue = String(value || '').trim();
            return trimmedValue !== '';
          });
          return hasValue;
        });

      return { headers: parsedHeaders, data: parsedData };
    } catch (error) {
      console.error('CSV Parsing Error:', error);
      setErrorMessage('CSV 파일 파싱에 실패했습니다. 파일 형식을 확인해주세요.');
      return { headers: [], data: [] };
    }
  };

  // Event handlers
  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async e => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const { headers: newHeaders, data: newData } = parseCSV(text);
        if (newHeaders.length > 0) {
          await appState.setHeaders(newHeaders);
          await appState.setData(newData);
          setErrorMessage('');
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage('파일을 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsText(file);
  };

  const handleAdd = () => {
    setEditingRowIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingRowIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (appState.data && window.confirm('이 레코드를 정말로 삭제하시겠습니까?')) {
      await appState.setData(appState.data.filter((_, i) => i !== index));
    }
  };

  const handleSaveInlineEdit = async (rowData: DataRow) => {
    if (appState.data) {
      const updatedData = appState.data.map((row, index) => {
        return Object.keys(openModals).some(id => {
          const modal = openModals.find(m => m.id === id);
          return modal && modal.rowIndex === index;
        }) ? rowData : row;
      });
      await appState.setData(updatedData);
    }
  };

  const handleSave = async (rowData: DataRow) => {
    if (appState.data) {
      // Validate that the row is not completely empty
      const isEmpty = Object.values(rowData).every(value =>
        String(value || '').trim() === ''
      );

      if (isEmpty) {
        setErrorMessage('최소 하나 이상의 항목을 입력해주세요.');
        return;
      }

      if (editingRowIndex !== null) {
        const updatedData = [...appState.data];
        updatedData[editingRowIndex] = rowData;
        await appState.setData(updatedData);
      } else {
        await appState.setData([...appState.data, rowData]);
      }
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRowIndex(null);
  };

  const handleReset = async () => {
    await appState.setHeaders([]);
    await appState.setData([]);
    await appState.setIsConfirmed(false);
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    await appState.setIsConfirmed(true);
  };

  const handleUnconfirm = async () => {
    await appState.setIsConfirmed(false);
  };

  const handleView = (index: number) => {
    if (appState.data) {
      // 모달 너비: 384px (w-96)
      // 화면 정중앙에 위치하도록 계산
      const modalWidth = 384;
      const centerX = Math.max(0, (window.innerWidth - modalWidth) / 2);
      const centerY = Math.max(0, (window.innerHeight - 400) / 2); // 대략적인 모달 높이 400px

      // 계단식 배치를 위해 약간의 오프셋 추가 (첫 모달은 정중앙, 이후는 우측 아래로 배치)
      const offsetX = openModals.length * 20;
      const offsetY = openModals.length * 20;

      const newModal: OpenModal = {
        id: `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        data: appState.data[index],
        rowIndex: index,
        position: {
          x: centerX + offsetX,
          y: centerY + offsetY
        },
        zIndex: nextZIndex
      };
      setOpenModals([...openModals, newModal]);
      setNextZIndex(nextZIndex + 1);
    }
  };

  const handleCloseDetailModal = (modalId: string) => {
    setOpenModals(openModals.filter(m => m.id !== modalId));
  };

  const handleBringToFront = (modalId: string) => {
    setOpenModals(openModals.map(m =>
      m.id === modalId ? { ...m, zIndex: nextZIndex } : m
    ));
    setNextZIndex(nextZIndex + 1);
  };

  const handleUpdateModalPosition = (modalId: string, position: {x: number, y: number}) => {
    setOpenModals(openModals.map(m =>
      m.id === modalId ? { ...m, position } : m
    ));
  };

  const handleCreateTable = async (name: string) => {
    await appState.createTable(name);
    setShowCreateTable(false);
  };

  const handleRenameTable = async (newName: string) => {
    if (appState.activeTableId) {
      await appState.renameTable(appState.activeTableId, newName);
      setShowRenameTable(false);
    }
  };

  const editingRow = editingRowIndex !== null && appState.data ? appState.data[editingRowIndex] : null;

  // 필터링된 데이터
  const getActiveTableName = () => appState.tables.find(t => t.id === appState.activeTableId)?.name;

  const filteredData = (() => {
    if (!appState.data) return appState.data;

    const activeTableName = getActiveTableName();

    // 건물정보 테이블: 유형 필터 적용
    if (activeTableName === '건물정보' && typeFilter) {
      return appState.data.filter(row => row['유형'] === typeFilter);
    }

    // 계약호실 테이블: 계약 필터 적용
    if (activeTableName === '계약호실' && contractFilter) {
      return applyContractFilter(appState.data, contractFilter);
    }

    return appState.data;
  })();

  if (appState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">로딩 중...</h1>
          <p className="text-gray-400">테이블을 불러오고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#111827', overflow: 'hidden' }}>
      {/* Table Navigation */}
      {appState.hasTables && (
        <TableSelector
          tables={appState.tables}
          activeTableId={appState.activeTableId}
          onSelectTable={appState.switchTable}
          onCreateTable={() => setShowCreateTable(true)}
          onDeleteTable={appState.deleteTable}
          onRenameTable={() => setShowRenameTable(true)}
        />
      )}

      {/* Main Content with Sidebar */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', width: '100%' }}>
        {/* Filter Sidebar */}
        <FilterSidebar onFilterChange={(filter, filterType) => {
          if (filterType === 'geonmul') {
            setTypeFilter(filter);
          } else if (filterType === 'geyak') {
            setContractFilter(filter);
          }
        }} />

        {/* Data Table Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {!appState.hasTables || !appState.activeTableId ? (
          // No tables or no active table - show welcome screen
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#111827' }}>
            <div className="w-full max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">
                CSV 데이터 관리자
              </h1>
              <p className="mb-8 text-lg text-gray-400">
                시작하려면 새 테이블을 만들거나 CSV 파일을 가져오세요.
              </p>
              <button
                onClick={() => setShowCreateTable(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                새 테이블 만들기
              </button>
            </div>
          </div>
        ) : appState.data === null || appState.data.length === 0 ? (
          // Table exists but no data - show upload screen
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#111827' }}>
            <div className="w-full max-w-4xl text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-4">
                {appState.tables.find(t => t.id === appState.activeTableId)?.name}
              </h1>
              <p className="mb-8 text-lg text-gray-400">
                CSV 파일을 업로드하여 데이터를 추가하세요.
              </p>
              <FileUpload onFileUpload={handleFileUpload} setErrorMessage={setErrorMessage} />
              {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
            </div>
          </div>
        ) : (
          // Table exists with data - show data table
          <DataTable
            headers={appState.headers}
            data={filteredData}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReset={handleReset}
            onView={handleView}
            onAppend={() => {}} // TODO: Implement append functionality
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            isConfirmed={appState.isConfirmed}
            onConfirm={handleConfirm}
            onUnconfirm={handleUnconfirm}
            tableName={appState.tables.find(t => t.id === appState.activeTableId)?.name}
          />
        )}
        </div>
      </div>

      {/* Modals */}
      <CreateTableModal
        isOpen={showCreateTable}
        onClose={() => setShowCreateTable(false)}
        onCreate={handleCreateTable}
      />

      {appState.activeTableId && (
        <>
          <RenameTableModal
            isOpen={showRenameTable}
            currentName={appState.tables.find(t => t.id === appState.activeTableId)?.name || ''}
            onClose={() => setShowRenameTable(false)}
            onRename={handleRenameTable}
          />

          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSave}
            headers={appState.headers}
            initialData={editingRow}
            tableName={appState.tables.find(t => t.id === appState.activeTableId)?.name}
            referenceData={appState.activeTableId !== appState.tables.find(t => t.name === '건물정보')?.id ? appState.data : []}
            referenceColumn="건물명"
            dropdownOptions={appState.tables.find(t => t.id === appState.activeTableId)?.name === '건물정보' ? {
              '위치': ['향교', '나루', '마곡', '발산', '신방화', '공항'],
              '유형': ['오피스텔', '상업용', '아파트', '지산', '기타']
            } : {}}
          />

          {openModals.map(modal => (
            <DetailModal
              key={modal.id}
              modalId={modal.id}
              isOpen={true}
              onClose={() => handleCloseDetailModal(modal.id)}
              onEdit={() => {
                handleEdit(modal.rowIndex);
                handleCloseDetailModal(modal.id);
              }}
              onSaveInlineEdit={handleSaveInlineEdit}
              onBringToFront={() => handleBringToFront(modal.id)}
              onUpdatePosition={(position) => handleUpdateModalPosition(modal.id, position)}
              data={modal.data}
              headers={appState.headers}
              position={modal.position}
              zIndex={modal.zIndex}
              dropdownOptions={appState.tables.find(t => t.id === appState.activeTableId)?.name === '건물정보' ? {
                '위치': ['향교', '나루', '마곡', '발산', '신방화', '공항'],
                '유형': ['오피스텔', '상업용', '아파트', '지산', '기타']
              } : {}}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default TableManager;
