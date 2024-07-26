import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center ', className)}>
      <Button
        variant='ghost'
        size='sm'
        className='-ml-3 h-8 data-[state=open]:bg-accent'
        onClick={column.getToggleSortingHandler()}
      >
        <span>{title}</span>
        {{
          asc: <ChevronUp className='ml-2 h-4 w-4' />,
          desc: <ChevronDown className='ml-2 h-4 w-4' />,
          false: <ChevronsUpDown className='ml-2 h-4 w-4' />,
        }[column.getIsSorted() as string] ?? null}
      </Button>
    </div>
  );
}
