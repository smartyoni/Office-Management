import React, { useState, useEffect, FormEvent } from 'react';
import { DataRow } from '../types';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rowData: DataRow) => void;
  headers: string[];
  initialData: DataRow | null;
  tableName?: string;
  referenceData?: DataRow[];
  referenceColumn?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, headers, initialData, tableName, referenceData = [], referenceColumn = '건물명' }) => {
  const [formData, setFormData] = useState<DataRow>({});
  const [validationError, setValidationError] = useState('');
  const [autocompleteOpen, setAutocompleteOpen] = useState<string | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const emptyRow = headers.reduce((acc, header) => {
        acc[header] = '';
        return acc;
      }, {} as DataRow);
      setFormData(emptyRow);
    }
    setValidationError('');
  }, [initialData, headers, isOpen]);

  if (!isOpen) return null;

  const handleChange = (header: string, value: string) => {
    setFormData(prev => ({ ...prev, [header]: value }));
    setValidationError('');

    // 자동완성 필드인 경우 필터링된 제안 업데이트
    if (header === referenceColumn && referenceData.length > 0) {
      if (value.trim().length > 0) {
        const filtered = Array.from(new Set(
          referenceData
            .map(row => String(row[referenceColumn] || ''))
            .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        )).sort();
        setFilteredSuggestions(filtered);
        setAutocompleteOpen(header);
      } else {
        setFilteredSuggestions([]);
        setAutocompleteOpen(null);
      }
    }
  };

  const handleSelectSuggestion = (header: string, suggestion: string) => {
    setFormData(prev => ({ ...prev, [header]: suggestion }));
    setAutocompleteOpen(null);
    setFilteredSuggestions([]);
  };

  // 행 데이터의 모든 필드가 비어있는지 확인
  const isRowEmpty = (row: DataRow): boolean => {
    return Object.values(row).every(value => {
      const trimmedValue = String(value || '').trim();
      return trimmedValue === '';
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 모든 필드가 비어있는 경우 저장하지 않음
    if (isRowEmpty(formData)) {
      setValidationError('최소 하나 이상의 항목을 입력해주세요.');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl transform transition-all" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-purple-700 flex justify-between items-center" style={{
            backgroundColor: '#7C3AED80'
          }}>
            <h3 className="text-xl font-semibold text-white">{initialData ? `${tableName} 수정` : `${tableName} 추가`}</h3>
            <button type="button" onClick={onClose} className="text-gray-200 hover:text-white">
                <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {validationError && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300 mb-4 col-span-2">
                {validationError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
            {headers.map(header => (
              <div key={header} className="relative">
                <label htmlFor={header} className="block mb-2 text-sm font-medium text-gray-300 capitalize">{header}</label>
                <input
                  type="text"
                  id={header}
                  name={header}
                  value={formData[header] || ''}
                  onChange={(e) => handleChange(header, e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  required
                  autoComplete="off"
                />
                {header === referenceColumn && autocompleteOpen === header && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectSuggestion(header, suggestion)}
                        className="px-3 py-2 text-white text-sm hover:bg-indigo-600 cursor-pointer transition-colors"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 transition-colors">
              취소
            </button>
            <button type="submit" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;