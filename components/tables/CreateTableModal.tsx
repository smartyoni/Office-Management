import React, { useState } from 'react';
import Icon from '../Icon';

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

/**
 * Modal for creating a new table
 * User enters table name and clicks Create
 */
export const CreateTableModal: React.FC<CreateTableModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [tableName, setTableName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!tableName.trim()) {
      setError('테이블 이름을 입력하세요');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await onCreate(tableName.trim());
      setTableName('');
      onClose();
    } catch (err) {
      setError('테이블 생성에 실패했습니다');
      console.error('Error creating table:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCreate();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">새 테이블 만들기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              테이블 이름
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => {
                setTableName(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="예: 고객 데이터"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <p className="text-sm text-gray-400">
            나중에 CSV 파일을 이 테이블로 가져올 수 있습니다.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading || !tableName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>생성 중...</span>
              </>
            ) : (
              <span>만들기</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTableModal;
