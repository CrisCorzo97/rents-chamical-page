'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { CustomSidebarHeader } from './custom-sidebar-header';
import { CustomSidebarContent } from './custom-sidebar-menu';
import { CustomSidebarFooter } from './custom-sidebar-footer';
import { useTour } from '@/components/tour/tour-provider';
import { TourStep } from '@/components/tour/tour';
import { useEffect, useMemo } from 'react';

export const CustomSidebar = () => {
  const { startTour } = useTour();

  const tourSteps: TourStep[] = useMemo(
    () => [
      {
        id: 'welcome',
        title: '¡Bienvenido!',
        description:
          'Te guiaremos a través de las principales áreas del portal.',
        target: '[data-tour="sidebar"]',
        position: 'right',
      },
      {
        id: 'resumen',
        title: 'Resumen',
        description:
          'En esta sección podrás ver el estado de tus pagos y deudas.',
        target: '[data-tour="resumen"]',
        position: 'right',
      },
      {
        id: 'mis-declaraciones',
        title: 'Mis Declaraciones',
        description:
          'Aquí se visualizarán tus declaraciones realizadas y podrás presentar nuevas.',
        target: '[data-tour="mis-declaraciones"]',
        position: 'right',
      },
      {
        id: 'mis-pagos',
        title: 'Mis Pagos',
        description:
          'En este apartado encontrarás el historial de tus pagos y podrás gestionar nuevos.',
        target: '[data-tour="mis-pagos"]',
        position: 'right',
      },
      {
        id: 'datos-contribuyente',
        title: 'Datos del contribuyente',
        description:
          'Aquí podrás verificar los datos de tu cuenta y cerrar sesión.',
        target: '[data-tour="datos-contribuyente"]',
        position: 'bottom',
      },
    ],
    []
  );

  useEffect(() => {
    if (!globalThis.localStorage.getItem(`tour-completed-sidebar`)) {
      startTour(tourSteps, 'sidebar');
    }
  }, [startTour, tourSteps]);

  return (
    <Sidebar variant='sidebar' collapsible='icon' data-tour='sidebar'>
      <CustomSidebarHeader />

      <CustomSidebarContent />

      <CustomSidebarFooter />
    </Sidebar>
  );
};
