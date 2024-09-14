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
      const init = pagination?.page - 3 < 0 ? 0 : pagination?.page - 3;
      const end =
        pagination?.page + 3 > pagination?.total_pages - 1
          ? pagination?.total_pages
          : pagination?.page + 3;

      return pages.slice(init, end);
    } else {
      return pages;
    }
  }, [pages, pagination]);

  return (
    <section className='flex items-center justify-between w-full'>
      <Pagination className='justify-start p-2 flex-1'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                handlePagination({
                  page: pagination?.page - 1 > 0 ? pagination?.page - 1 : 1,
                  limit: pagination?.limit_per_page,
                })
              }
              disabled={pagination?.page === 1}
            />
          </PaginationItem>
          {pagesRendered[0] > 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            {pagesRendered.map((page) => {
              const isCurrent = pagination?.page === page;

              return (
                <PaginationLink
                  key={page}
                  size='sm'
                  onClick={() =>
                    handlePagination({
                      page,
                      limit: pagination?.limit_per_page,
                    })
                  }
                  isActive={isCurrent ? true : undefined}
                >
                  {page}
                </PaginationLink>
              );
            })}
          </PaginationItem>
          {pagination?.total_pages >
            pagesRendered[pagesRendered.length - 1] && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
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
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className='flex items-center justify-end gap-2 p-2 flex-1'>
        <span className='text-sm'>
          {`${pagination?.limit_per_page * (pagination?.page - 1) + 1} - ${
            pagination?.limit_per_page * pagination?.page
          } de ${pagination?.total_items} registros.`}
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
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
