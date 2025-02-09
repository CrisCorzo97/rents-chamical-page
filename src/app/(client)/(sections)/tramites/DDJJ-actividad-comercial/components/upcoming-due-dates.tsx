'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import { Declaration } from '../types';

interface UpcomingDueDatesProps {
  declarations: Declaration[];
}

export default function UpcomingDueDates({
  declarations,
}: UpcomingDueDatesProps) {
  const upcomingDeclarations = declarations
    .filter((d) => d.status === 'pending')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CalendarClock className='h-5 w-5' />
          Upcoming Due Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {upcomingDeclarations.map((declaration) => {
            const dueDate = new Date(declaration.dueDate);
            const daysUntilDue = Math.ceil(
              (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={declaration.id}
                className='flex items-center justify-between p-4 bg-blue-100 rounded-lg'
              >
                <div>
                  <div className='font-medium'>
                    {new Date(declaration.period).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  <div className='text-sm text-gray-500'>
                    Due: {dueDate.toLocaleDateString()}
                  </div>
                </div>
                {daysUntilDue <= 5 && (
                  <div className='flex items-center text-red-500'>
                    <AlertTriangle className='h-4 w-4 mr-1' />
                    <span className='text-sm'>{daysUntilDue} days left</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
