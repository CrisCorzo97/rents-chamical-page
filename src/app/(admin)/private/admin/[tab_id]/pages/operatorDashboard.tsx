'use client';
import { Button } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/cn';
import clsx from 'clsx';
import {
  CircleChevronRight,
  Home,
  LineChart,
  Settings,
  Users2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const OperatorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <aside
      className={cn(
        `inset-y-0 left-0 w-14 z-10 hidden transition-all flex-col border-r bg-background sm:flex`,
        clsx({
          'w-60': sidebarOpen,
        })
      )}
    >
      <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground md:h-8 md:w-8',
                  clsx({
                    'gap-2 justify-start px-4 w-full md:w-full': sidebarOpen,
                  })
                )}
              >
                <Home className='h-5 w-5' />
                <span
                  className={cn(
                    'sr-only transition',
                    clsx({
                      'not-sr-only': sidebarOpen,
                    })
                  )}
                >
                  Dashboard
                </span>
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent
                side='right'
                className='bg-slate-900 text-white opacity-80'
              >
                Dashboard
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground md:h-8 md:w-8',
                  clsx({
                    'gap-2 justify-start px-4 w-full md:w-full': sidebarOpen,
                  })
                )}
              >
                <Users2 className='h-5 w-5' />
                <span
                  className={cn(
                    'sr-only transition',
                    clsx({
                      'not-sr-only': sidebarOpen,
                    })
                  )}
                >
                  Customers
                </span>
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent
                side='right'
                className='bg-slate-900 text-white opacity-80'
              >
                Customers
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground md:h-8 md:w-8',
                  clsx({
                    'gap-2 justify-start px-4 w-full md:w-full': sidebarOpen,
                  })
                )}
              >
                <LineChart className='h-5 w-5' />
                <span
                  className={cn(
                    'sr-only transition',
                    clsx({
                      'not-sr-only': sidebarOpen,
                    })
                  )}
                >
                  Analytics
                </span>
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent
                side='right'
                className='bg-slate-900 text-white opacity-80'
              >
                Analytics
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href='#'
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground md:h-8 md:w-8',
                  clsx({
                    'gap-2 justify-start px-4 w-full md:w-full': sidebarOpen,
                  })
                )}
              >
                <Settings className='h-5 w-5' />
                <span
                  className={cn(
                    'sr-only transition',
                    clsx({
                      'not-sr-only': sidebarOpen,
                    })
                  )}
                >
                  Settings
                </span>
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent
                side='right'
                className='bg-slate-900 text-white opacity-80'
              >
                Settings
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='default'
                size='lg'
                className={cn(
                  'flex p-0 h-9 w-9 items-center justify-center rounded-lg text-white font-normal transition md:h-8 md:w-8',
                  clsx({
                    'gap-2 justify-start px-4 w-full md:w-full': sidebarOpen,
                  })
                )}
                onClick={() => {
                  setSidebarOpen((prev) => !prev);
                }}
              >
                <CircleChevronRight
                  className={cn(
                    'h-5 w-5',
                    clsx({
                      'transform rotate-180': sidebarOpen,
                    })
                  )}
                />
                <span
                  className={cn(
                    'sr-only text-base transition',
                    clsx({
                      'not-sr-only': sidebarOpen,
                    })
                  )}
                >
                  Acoplar
                </span>
              </Button>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent
                side='right'
                className='bg-slate-900 text-white opacity-80'
              >
                Expandir
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};
