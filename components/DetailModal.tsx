import React, { useState, useRef } from 'react';
import { DataRow } from '../types';
import Icon from './Icon';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  data: DataRow | null;
  headers?: string[];
  modalId?: string;
  position?: {x: number, y: number};
  zIndex?: number;
  onBringToFront?: () => void;
  onUpdatePosition?: (position: {x: number, y: number}) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  data,
  headers = [],
  modalId,
  position = {x: 100, y: 100},
  zIndex = 100,
  onBringToFront,
  onUpdatePosition,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const headerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  // 첫 컬럼의 값을 제목으로 사용 (headers의 첫 번째 키)
  const firstColumnKey = headers.length > 0 ? headers[0] : Object.keys(data)[0];
  const firstColumnValue = data[firstColumnKey] || '';
  const title = `${firstColumnValue} 상세정보`;

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
      }}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-96 transform transition-shadow"
        onClick={e => e.stopPropagation()}
      >
        <div
          ref={headerRef}
          onMouseDown={handleHeaderMouseDown}
          className="px-6 py-4 border-b border-purple-700 flex justify-between items-center cursor-move select-none"
          style={{
            backgroundColor: isDragging ? '#6B21A8' : '#7C3AED80',
            userSelect: 'none',
          }}
        >
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-200 hover:text-white">
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {Object.entries(data).map(([key, value]) => {
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

            return (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'start', padding: '0.25rem 0' }}>
                <dt style={{ fontSize: '0.875rem', fontWeight: '500', color: '#9CA3AF', wordBreak: 'break-word' }}>{key}</dt>
                <dd style={{ fontSize: '0.875rem', color: '#fff', margin: 0, wordBreak: 'break-word', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isPhoneColumn && phoneValue ? (
                    <a
                      href={`sms:${phoneValue}`}
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
                    <span>{String(value)}</span>
                  )}
                  {isJibun && jibunValue && (
                    <a
                      href={`https://map.kakao.com/link/search/${encodeURIComponent(jibunValue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
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
                </dd>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700 flex justify-end items-center gap-2">
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