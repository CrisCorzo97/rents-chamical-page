import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useQueryParams } from '@/hooks';
import { Pagination as ResponsePagination } from '@/types/envelope';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

type TablePagination = {
  query_id: string;
  pagination: ResponsePagination;
};

export function TablePagination(props: TablePagination) {
  const { query_id, pagination } = props;

  const { getUpdatedURLQuery, updateURLQuery } = useQueryParams();

  const pages = Array.from(
    { length: pagination?.total_pages },
    (_, i) => i + 1
  );

  const pagesRendered =
    pages.length > 5
      ? pages.slice(
          pagination?.page - 3 < 0 ? 0 : pagination?.page - 3,
          pagination?.page + 4 > pagination?.total_pages - 1
            ? pagination?.total_pages
            : pagination?.page + 4
        )
      : pages;

  return (
    <section className='flex items-center justify-between w-full'>
      <Pagination className='justify-start p-2 flex-1'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={getUpdatedURLQuery({
                page: pagination?.page - 1 > 0 ? pagination?.page - 1 : 1,
              })}
              aria-disabled={pagination.page === 1}
              replace
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
                  href={getUpdatedURLQuery({
                    page,
                  })}
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
              href={getUpdatedURLQuery({
                page:
                  pagination?.page + 1 <= pagination?.total_pages
                    ? pagination?.page + 1
                    : pagination?.total_pages,
              })}
              aria-disabled={pagination.page === pagination.total_pages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className='flex items-center justify-end gap-2 p-2 flex-1'>
        <span className='text-sm'>
          {`${pagination?.limit_per_page} de ${pagination?.total_items} registros.`}
        </span>

        <Select
          defaultValue={`${pagination.limit_per_page}`}
          onValueChange={(value) => {
            updateURLQuery({
              page: 1,
              limit: value,
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
