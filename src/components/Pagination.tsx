import React from 'react';
import { PaginationProps } from '@/types/paginationProps';
import { PaginationButtonProps } from '@/types/paginationButtonProps';

const PaginationButton: React.FC<PaginationButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  active = false, 
  ariaLabel 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`px-3 py-1 rounded border ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'hover:bg-gray-100 border-gray-300'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } transition-colors`}
    >
      {children}
    </button>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showItemsPerPage = false,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [6, 12, 24, 48]
}) => {
  const maxVisiblePages = 5;
  
  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers[0] > 1;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex justify-center">
        <nav className="flex items-center gap-1">
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            «
          </PaginationButton>
          
          <PaginationButton
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </PaginationButton>

          {showStartEllipsis && (
            <span className="px-3 py-1">...</span>
          )}

          {pageNumbers.map(number => (
            <PaginationButton
              key={number}
              onClick={() => onPageChange(number)}
              active={currentPage === number}
              aria-label={`Page ${number}`}
            >
              {number}
            </PaginationButton>
          ))}

          {showEndEllipsis && (
            <span className="px-3 py-1">...</span>
          )}

          <PaginationButton
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </PaginationButton>
          
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            »
          </PaginationButton>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;