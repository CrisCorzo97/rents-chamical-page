'use client';

import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Action {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: (row: any) => void;
  href?: string;
  targetBlank?: boolean;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface ActionButtonsProps {
  row: any;
  actions: Action[];
}

const ActionButton = ({ action, row }: { action: Action; row: any }) => {
  const buttonContent = (
    <Button variant='outline' size='icon' disabled={action.disabled}>
      {action.icon}
      <span className='sr-only'>{action.label}</span>
    </Button>
  );

  if (action.requiresConfirmation) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{buttonContent}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
            <AlertDialogDescription>
              {action.confirmationMessage ||
                '¿Estás seguro de que deseas realizar esta acción?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => action.onClick(row)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return action.href ? (
    <Link href={action.href} target={action.targetBlank ? '_blank' : undefined}>
      {buttonContent}
    </Link>
  ) : (
    <div
      onClick={(e) => {
        e.stopPropagation();
        action.onClick(row);
      }}
    >
      {buttonContent}
    </div>
  );
};

export function ActionButtons({ row, actions }: ActionButtonsProps) {
  if (actions.length <= 2) {
    return (
      <div className='flex space-x-2'>
        <TooltipProvider>
          {actions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <ActionButton action={action} row={row} />
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
              if (!action.requiresConfirmation) {
                action.onClick(row);
              }
            }}
            disabled={action.disabled}
            asChild={!!action.href || action.requiresConfirmation}
          >
            {action.requiresConfirmation ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className='flex items-center gap-2'>
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
                    <AlertDialogDescription>
                      {action.confirmationMessage ||
                        '¿Estás seguro de que deseas realizar esta acción?'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => action.onClick(row)}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : action.href ? (
              <Link href={action.href} target='_blank'>
                <div className='flex items-center gap-2'>
                  {action.icon}
                  <span>{action.label}</span>
                </div>
              </Link>
            ) : (
              <div className='flex items-center gap-2'>
                {action.icon}
                <span>{action.label}</span>
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
