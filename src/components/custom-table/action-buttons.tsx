'use client';

import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Action {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: (row: any) => void;
}

interface ActionButtonsProps {
  row: any;
  actions: Action[];
}

export function ActionButtons({ row, actions }: ActionButtonsProps) {
  if (actions.length <= 2) {
    return (
      <div className='flex space-x-2'>
        <TooltipProvider>
          {actions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row);
                  }}
                  disabled={action.disabled}
                >
                  {action.icon}
                  <span className='sr-only'>{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <EllipsisVertical className='h-4 w-4' />
          <span className='sr-only'>Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
            disabled={action.disabled}
          >
            <div className='flex items-center gap-2'>
              {action.icon}
              <span>{action.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
