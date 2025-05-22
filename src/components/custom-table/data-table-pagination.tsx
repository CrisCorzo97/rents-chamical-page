import { type Pagination as LibPagination } from '@/types/envelope'; // Renombrar para evitar conflicto
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'; // Importar componentes de Shadcn

interface DataTablePaginationProps {
  pagination: LibPagination;
  onPageChange?: (page: number) => void;
  currentLimit?: number;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  pageButtonCount?: number;
}

function getPaginationRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number = 1
): (number | '...')[] {
  const totalPageNumbers = siblingCount + 5;
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', totalPages];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, '...', ...rightRange];
  }
  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }
  return [];
}

export function DataTablePagination({
  pagination,
  onPageChange,
  currentLimit = 10,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
  pageButtonCount = 1,
}: DataTablePaginationProps) {
  const { page: currentPage, totalPages, totalItems } = pagination;

  if (!totalPages || totalPages === 0) {
    return null;
  }

  const paginationRange = getPaginationRange(
    totalPages,
    currentPage,
    pageButtonCount
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4'>
      <div className='text-sm text-muted-foreground flex-shrink-0'>
        {totalItems} resultados
      </div>

      <div className='flex items-center justify-center gap-x-4 gap-y-2'>
        {/* Selector de Límite */}
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium hidden xs:block'>Filas:</p>
          <Select
            value={String(currentLimit)}
            onValueChange={(value) => {
              onLimitChange?.(Number(value));
            }}
          >
            <SelectTrigger className='h-9 w-[70px]'>
              {/* Ajustado h-9 para consistencia con PaginationLink default size */}
              <SelectValue placeholder={String(currentLimit)} />
            </SelectTrigger>
            <SelectContent side='top'>
              {limitOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paginación con componentes Shadcn */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  handlePrevious();
                }}
                className={
                  currentPage <= 1
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </PaginationItem>

            {paginationRange.map((pageNumber, index) => (
              <PaginationItem
                key={
                  typeof pageNumber === 'number'
                    ? `page-${pageNumber}`
                    : `dots-${index}`
                }
              >
                {pageNumber === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(pageNumber as number);
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className={
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
