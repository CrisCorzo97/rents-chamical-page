import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Pagination as ResponsePagination } from '@/types/envelope';
import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type TablePagination = {
  pagination: ResponsePagination;
  handlePagination: (
    input: {
      page: number;
      limit: number;
    },
    options?: {
      getUrl: boolean;
    }
  ) => void | URL;
};

export function TablePagination(props: TablePagination) {
  const { pagination, handlePagination } = props;

  const pages = useMemo(() => {
    return Array.from({ length: pagination?.total_pages }, (_, i) => i + 1);
  }, [pagination]);

  const pagesRendered = useMemo(() => {
    if (pages.length > 5) {
      const init = pagination?.page - 2 < 0 ? 0 : pagination?.page - 2;
      const end =
        pagination?.page + 2 > pagination?.total_pages - 1
          ? pagination?.total_pages
          : pagination?.page + 2;

      return pages.slice(init, end);
    } else {
      return pages;
    }
  }, [pages, pagination]);

  const currentRange = useMemo(() => {
    const start = pagination?.limit_per_page * (pagination?.page - 1) + 1;
    const end = Math.min(
      pagination?.limit_per_page * pagination?.page,
      pagination?.total_items
    );
    return `${start} - ${end} de ${pagination?.total_items}`;
  }, [pagination]);

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between w-full gap-4 p-4'>
      <div className='flex items-center justify-center w-full sm:w-auto order-2 sm:order-1'>
        <Pagination>
          <PaginationContent className='gap-1 md:gap-2'>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePagination({
                    page: pagination?.page - 1 > 0 ? pagination?.page - 1 : 1,
                    limit: pagination?.limit_per_page,
                  })
                }
                disabled={pagination?.page === 1}
                className='h-8 w-8 p-0 sm:h-9 sm:w-9 sm:p-2'
              />
            </PaginationItem>

            <div className='hidden sm:flex items-center gap-1'>
              {pagesRendered[0] > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pagesRendered.map((page) => {
                const isCurrent = pagination?.page === page;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() =>
                        handlePagination({
                          page,
                          limit: pagination?.limit_per_page,
                        })
                      }
                      isActive={isCurrent}
                      className='h-8 min-w-8 sm:h-9 sm:min-w-9'
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {pagination?.total_pages >
                pagesRendered[pagesRendered.length - 1] && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </div>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePagination({
                    page:
                      pagination?.page + 1 <= pagination?.total_pages
                        ? pagination?.page + 1
                        : pagination?.total_pages,
                    limit: pagination?.limit_per_page,
                  })
                }
                disabled={pagination?.page === pagination?.total_pages}
                className='h-8 w-8 p-0 sm:h-9 sm:w-9 sm:p-2'
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto order-1 sm:order-2'>
        <span className='text-sm text-muted-foreground whitespace-nowrap'>
          {currentRange}
        </span>

        <Select
          defaultValue={`${pagination?.limit_per_page}`}
          onValueChange={(value) => {
            handlePagination({
              page: 1,
              limit: Number(value),
            });
          }}
        >
          <SelectTrigger className='w-[100px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='5'>5 / pág</SelectItem>
              <SelectItem value='10'>10 / pág</SelectItem>
              <SelectItem value='20'>20 / pág</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
