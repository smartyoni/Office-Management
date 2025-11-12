import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useActiveTable } from '../../hooks/useActiveTable';

/**
 * Filter Sidebar Component
 *
 * 테이블의 좌측에 고정되는 필터 사이드바
 * - 고정 너비: 300px
 * - 항상 열려있음 (접기/펼치기 없음)
 * - 건물정보 테이블의 유형 필터 제공
 */

interface FilterContextType {
  selectedTypeFilter: string | null;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    return { selectedTypeFilter: null };
  }
  return context;
};

interface FilterSidebarProps {
  onFilterChange?: (filter: string | null, filterType?: 'geonmul' | 'geyak') => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const appState = useActiveTable();
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(null);
  const [selectedContractFilter, setSelectedContractFilter] = useState<string | null>(null);

  const activeTableName = appState.tables.find(t => t.id === appState.activeTableId)?.name;
  const isGeonmuljeongboTable = activeTableName === '건물정보';
  const isGeyakhosilTable = activeTableName === '계약호실';

  const handleFilterClick = (filterValue: string, tableType: 'geonmul' | 'geyak') => {
    if (tableType === 'geonmul') {
      const newFilter = selectedTypeFilter === filterValue ? null : filterValue;
      setSelectedTypeFilter(newFilter);
      onFilterChange?.(newFilter, 'geonmul');
    } else if (tableType === 'geyak') {
      const newFilter = selectedContractFilter === filterValue ? null : filterValue;
      setSelectedContractFilter(newFilter);
      onFilterChange?.(newFilter, 'geyak');
    }
  };

  const geonmulFilters = [
    { label: '오피스텔', value: '오피스텔' },
    { label: '상업용', value: '상업용' },
    { label: '아파트', value: '아파트' },
    { label: '지식산업센터', value: '지산' },
    { label: '기타', value: '기타' },
  ];

  const geyakFilters = [
    { label: '금월계약', value: 'monthly_contract' },
    { label: '금월잔금', value: 'monthly_payment' },
    { label: '계약예정', value: 'scheduled_contract' },
  ];

  const getGeonmulFilterCount = (filterValue: string): number => {
    return appState.data?.filter(row => row['유형'] === filterValue).length || 0;
  };

  const getGeyakFilterCount = (filterValue: string): number => {
    if (!appState.data) return 0;

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    return appState.data.filter(row => {
      if (filterValue === 'monthly_contract') {
        const contractDate = row['계약서작성일'];
        if (!contractDate) return false;
        const date = parseDate(contractDate);
        return date && date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      } else if (filterValue === 'monthly_payment') {
        const paymentDate = row['잔금일'];
        if (!paymentDate) return false;
        const date = parseDate(paymentDate);
        return date && date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      } else if (filterValue === 'scheduled_contract') {
        const contractDate = row['계약서작성일'];
        if (!contractDate) return false;
        const date = parseDate(contractDate);
        if (!date) return false;
        const nextMonth = new Date(currentYear, currentMonth, 1);
        return date > nextMonth;
      }
      return false;
    }).length;
  };

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    // 지원하는 형식: YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD
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

  const renderFilterButtons = (filters: typeof geonmulFilters, selectedFilter: string | null, tableType: 'geonmul' | 'geyak', getCount: (value: string) => number) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value, tableType)}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: selectedFilter === filter.value ? '#059669' : '#f3f4f6',
              color: selectedFilter === filter.value ? 'white' : 'rgb(0, 0, 0)',
              border: selectedFilter === filter.value ? '2px solid #047857' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              ':hover': {
                backgroundColor: selectedFilter === filter.value ? '#047857' : '#e5e7eb'
              }
            }}
            onMouseEnter={(e) => {
              if (selectedFilter !== filter.value) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedFilter === filter.value ? '#059669' : '#f3f4f6';
            }}
          >
            <span>{filter.label}</span>
            <span>({getCount(filter.value)})</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: '300px',
        minWidth: '300px',
        maxWidth: '300px',
        backgroundColor: 'rgb(255, 255, 255)',
        borderRight: '1px solid rgb(156, 163, 175)',
        height: '100%',
        overflowY: 'auto',
        flexShrink: 0,
        color: 'rgb(0, 0, 0)',
        padding: '1rem'
      }}
    >
      {isGeonmuljeongboTable && (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', borderBottom: '2px solid #059669', paddingBottom: '0.5rem' }}>
            필터
          </h3>
          {renderFilterButtons(geonmulFilters, selectedTypeFilter, 'geonmul', getGeonmulFilterCount)}
        </div>
      )}
      {isGeyakhosilTable && (
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', borderBottom: '2px solid #059669', paddingBottom: '0.5rem' }}>
            필터
          </h3>
          {renderFilterButtons(geyakFilters, selectedContractFilter, 'geyak', getGeyakFilterCount)}
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
