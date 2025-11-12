import React, { useState, useRef } from 'react';
import { DataRow } from '../types';
import Icon from './Icon';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onSaveInlineEdit?: (data: DataRow) => void;
  data: DataRow | null;
  headers?: string[];
  modalId?: string;
  position?: {x: number, y: number};
  zIndex?: number;
  onBringToFront?: () => void;
  onUpdatePosition?: (position: {x: number, y: number}) => void;
  dropdownOptions?: { [key: string]: string[] };
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onSaveInlineEdit,
  data,
  headers = [],
  modalId,
  position = {x: 100, y: 100},
  zIndex = 100,
  onBringToFront,
  onUpdatePosition,
  dropdownOptions = {},
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingData, setEditingData] = useState<DataRow>({});
  const headerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && data) {
      setEditingData(data);
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  // 첫 컬럼의 값을 제목으로 사용 (headers의 첫 번째 키)
  const firstColumnKey = headers.length > 0 ? headers[0] : Object.keys(data)[0];
  const firstColumnValue = data[firstColumnKey] || '';
  const title = `${firstColumnValue} 상세정보`;

  const handleFieldDoubleClick = (key: string, value: string) => {
    setEditingField(key);
    setEditingValue(value);
  };

  const handleSaveFieldEdit = (key: string) => {
    setEditingData(prev => ({ ...prev, [key]: editingValue }));
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onBringToFront) {
      onBringToFront();
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  React.useEffect(() => {
    if (!isDragging || !onUpdatePosition) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onUpdatePosition({x: newX, y: newY});
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onUpdatePosition]);

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
        pointerEvents: 'auto',
        width: '56rem',
      }}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-xl h-full transform transition-shadow"
        onClick={e => e.stopPropagation()}
      >
        <div
          ref={headerRef}
          onMouseDown={handleHeaderMouseDown}
          className="px-6 py-4 border-b border-green-700 flex justify-between items-center cursor-move select-none"
          style={{
            backgroundColor: isDragging ? '#047857' : '#10B98180',
            userSelect: 'none',
          }}
        >
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-200 hover:text-white">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto" style={{ backgroundColor: '#10B98110' }}>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(editingData).map(([key, value]) => {
              const isJibun = key.toLowerCase().includes('지번') || key === '지번';
              const jibunValue = isJibun ? String(value).trim() : '';

              const isPhoneColumn = key.toLowerCase().includes('전화') ||
                                    key.toLowerCase().includes('휴대폰') ||
                                    key.toLowerCase().includes('핸드폰') ||
                                    key.toLowerCase().includes('번호') ||
                                    key.toLowerCase().includes('phone') ||
                                    key.toLowerCase().includes('tel') ||
                                    key.toLowerCase().includes('mobile');
              const phoneValue = isPhoneColumn ? String(value).replace(/[^0-9]/g, '') : '';
              const isMemoField = key.toLowerCase().includes('메모');

              return (
                <div key={key} className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-300 capitalize">{key}</label>
                  {editingField === key && isMemoField ? (
                    <div className="flex gap-2">
                      <textarea
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="bg-gray-700 border border-green-500 text-white text-sm rounded-lg block flex-1 p-2.5"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-1 flex-col justify-center">
                        <button
                          onClick={() => handleSaveFieldEdit(key)}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : dropdownOptions[key] ? (
                    <div className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5">
                      <span>{String(value) || '(선택되지 않음)'}</span>
                    </div>
                  ) : (
                    <div
                      className={`bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 break-words ${isMemoField ? 'cursor-pointer hover:border-green-500 transition-colors' : ''}`}
                      onDoubleClick={() => isMemoField && handleFieldDoubleClick(key, String(value))}
                      title={isMemoField ? "더블클릭으로 편집" : ""}
                      style={{ minHeight: isMemoField ? '60px' : 'auto', whiteSpace: isMemoField ? 'pre-wrap' : 'normal' }}
                    >
                      {isPhoneColumn && phoneValue ? (
                        <a
                          href={`sms:${phoneValue}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: '#3B82F6',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#1D4ED8')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#3B82F6')}
                        >
                          {String(value)}
                        </a>
                      ) : (
                        <span>{String(value) || '(비어있음)'}</span>
                      )}
                      {isJibun && jibunValue && (
                        <a
                          href={`https://map.kakao.com/link/search/${encodeURIComponent(jibunValue)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            marginLeft: '0.5rem',
                            paddingLeft: '0.625rem',
                            paddingRight: '0.625rem',
                            paddingTop: '0.375rem',
                            paddingBottom: '0.375rem',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            color: '#000',
                            backgroundColor: '#FFDE00',
                            borderRadius: '0.375rem',
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFEE33')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFDE00')}
                        >
                          📍 지도보기
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700 flex justify-end items-center gap-2">
          {editingData !== data && onSaveInlineEdit && (
            <button type="button" onClick={() => {
              onSaveInlineEdit(editingData);
              onClose();
            }} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
              변경사항 저장
            </button>
          )}
          {onEdit && (
            <button type="button" onClick={onEdit} className="py-2 px-4 rounded-md text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 transition-colors">
              수정
            </button>
          )}
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;