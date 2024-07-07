import { buildUrlQuery, getQueryParams } from '@/lib/url';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useFilter<RecordType extends object>(tableName: string) {
  const [filters, setFilters] = useState<RecordType>({} as RecordType);

  const { replace } = useRouter();
  const queries = getQueryParams();

  const other_queries = Object.fromEntries(
    Object.entries(queries).filter(([key]) => !key.includes(tableName))
  );

  for (const key in queries) {
    if (key.includes(tableName)) {
      const filterKey = key.split(`${tableName}_`)[1];

      setFilters((prev) => ({ ...prev, [filterKey]: queries[key] }));
    }
  }

  const updateFilter = (newFilter: Partial<RecordType>) => {
    const newFilterKey = Object.keys(newFilter)[0];

    for (const key in filters) {
      if (key === newFilterKey) {
        setFilters((prev) => ({ ...prev, [key]: newFilter[key] }));
      }
    }

    const newFiltersParsed = Object.entries(filters).reduce(
      (obj, [key, value]) => {
        if (value) {
          obj[`${tableName}_${key}`] = value;
        }
        return obj;
      },
      {} as Record<string, string>
    );

    const urlToReplace = buildUrlQuery({
      ...other_queries,
      ...newFiltersParsed,
    });

    replace(urlToReplace);
  };

  return { updateFilter };
}
