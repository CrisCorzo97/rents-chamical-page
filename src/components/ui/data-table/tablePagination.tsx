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
import { useFPS } from '@/hooks/useFPS';
import { Pagination as ResponsePagination } from '@/types/envelope';
import { URL } from 'url';

type TablePagination = {
  query_id: string;
  pagination: ResponsePagination;
};

export function TablePagination(props: TablePagination) {
  const { pagination, query_id } = props;

  const { getUpdatedURL } = useQueryParams();

  // const handlePrevious = () => {
  //   const page = pagination.page - 1 > 0 ? pagination.page - 1 : 1;

  //   const url = getUpdatedURL({
  //     page,
  //     items_per_page: pagination.limit_per_page,
  //   });

  //   return url;
  // };

  // const handleNext = () => {
  //   const page =
  //     pagination.page + 1 <= pagination.total_pages
  //       ? pagination.page + 1
  //       : pagination.total_pages;

  //   handlePagination({
  //     page,
  //     items_per_page: pagination.limit_per_page,
  //   });
  // };

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
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getUpdatedURL({
              page: pagination?.page - 1 > 0 ? pagination?.page - 1 : 1,
              limit: pagination?.limit_per_page,
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
                href={getUpdatedURL({
                  page,
                  limit: pagination?.limit_per_page,
                })}
                isActive={isCurrent ? true : undefined}
              >
                {page}
              </PaginationLink>
            );
          })}
        </PaginationItem>
        {pagination?.total_pages > pagesRendered[pagesRendered.length - 1] && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href={getUpdatedURL({
              page:
                pagination?.page + 1 <= pagination?.total_pages
                  ? pagination?.page + 1
                  : pagination?.total_pages,
              limit: pagination?.limit_per_page,
            })}
            aria-disabled={pagination.page === pagination.total_pages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
