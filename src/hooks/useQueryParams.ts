import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export type QueryParams = Record<string, string | string[] | number>;

export function useQueryParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = (() => new URLSearchParams(searchParams ?? ''))();

  const generateQuery = useCallback(() => {
    const query = Object.fromEntries(params.entries());
    return query;
  }, [params]);

  const getQueryValue = useCallback(
    (key: string): string | null => {
      const queryValue = params.get(key);
      return queryValue;
    },
    [params]
  );

  const updateURLQuery = useCallback(
    (newParams: QueryParams): void => {
      const query = Object.entries(newParams);

      query.map(([key, value]) => {
        if (!value || value === '') {
          params.delete(key);
        } else {
          params.set(key, `${value}`);
        }
      });

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [params, pathname, replace]
  );

  const getUpdatedURLQuery = useCallback(
    (newParams: QueryParams): URL => {
      const query = Object.entries(newParams);

      query.map(([key, value]) => {
        if (!value || value === '') {
          params.delete(key);
        } else {
          params.set(key, `${value}`);
        }
      });

      const url = new URL(
        `${pathname}?${params.toString()}`,
        globalThis.location?.origin
      );

      return url;
    },
    [params, pathname]
  );

  return {
    getQueryValue,
    updateURLQuery,
    generateQuery,
    getUpdatedURLQuery,
  };
}
