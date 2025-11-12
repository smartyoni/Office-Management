import React from 'react';

/**
 * Filter Sidebar Component
 *
 * 테이블의 좌측에 고정되는 필터 사이드바
 * - 고정 너비: 300px
 * - 항상 열려있음 (접기/펼치기 없음)
 * - 빈 흰색 영역만 제공
 */
interface FilterSidebarProps {
  // 향후 필터 기능 추가 시 필요한 props 추가 예정
}

const FilterSidebar: React.FC<FilterSidebarProps> = () => {
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
        color: 'rgb(0, 0, 0)'
      }}
    >
      {/* 사이드바 필터 영역 */}
    </aside>
  );
};

export default FilterSidebar;
