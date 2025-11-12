import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import Icon from './Icon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  setErrorMessage: (message: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, setErrorMessage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setErrorMessage('');
        onFileUpload(file);
      } else {
        setErrorMessage('잘못된 파일 형식입니다. .csv 파일을 업로드해주세요.');
      }
    }
  }, [onFileUpload, setErrorMessage]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files ? e.target.files[0] : null);
  };

  // FIX: Changed DragEvent<HTMLDivElement> to DragEvent<HTMLLabelElement> because the event handler is attached to a <label> element.
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // FIX: Changed DragEvent<HTMLDivElement> to DragEvent<HTMLLabelElement> because the event handler is attached to a <label> element.
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // FIX: Changed DragEvent<HTMLDivElement> to DragEvent<HTMLLabelElement> because the event handler is attached to a <label> element.
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full max-w-lg h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
          ${isDragging ? 'border-indigo-400 bg-gray-800' : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <Icon name="upload" className="w-10 h-10 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-indigo-400">클릭하여 업로드</span>하거나 파일을 끌어다 놓으세요
            </p>
            <p className="text-xs text-gray-500">CSV 파일만 가능</p>
          </div>
          <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
        </label>
    </div>
  );
};

export default FileUpload;