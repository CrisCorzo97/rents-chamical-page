import { Skeleton } from '../ui/skeleton';

export function TableSkeleton({
  title,
  columns = 4,
  rows = 4,
}: {
  title?: string;
  columns?: number;
  rows?: number;
}) {
  return (
    <div className='w-full space-y-4'>
      {title ? (
        <h2 className='text-xl font-semibold tracking-tight py-4'>{title}</h2>
      ) : (
        <Skeleton className='h-5 w-1/5 bg-border rounded py-4 mt-6' />
      )}
      <div className='space-y-2 animate-pulse'>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className='flex gap-2'>
            {[...Array(columns)].map((_, j) => (
              <Skeleton key={j} className='h-10 flex-1 bg-border rounded' />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
