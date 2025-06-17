'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { Badge } from '../ui';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector del elemento objetivo
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: { x: number; y: number };
}

export interface TourProps {
  steps: TourStep[];
  currentStep: number;
  isOpen: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  showStepNumbers?: boolean;
  className?: string;
}

interface Position {
  top: number;
  left: number;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tour({
  steps,
  currentStep,
  isOpen,
  onNext,
  onPrevious,
  onClose,
  onSkip,
  showSkip = true,
  showStepNumbers = true,
  className = '',
}: TourProps) {
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    position: 'bottom',
  });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const updatePosition = () => {
      const target = document.querySelector(
        currentStepData.target
      ) as HTMLElement;
      if (!target || !tooltipRef.current) return;

      setTargetElement(target);

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const newPosition: Position = { top: 0, left: 0, position: 'bottom' };
      const offset = currentStepData.offset || { x: 0, y: 0 };
      const margin = 16;

      // Determinar la mejor posición
      const preferredPosition = currentStepData.position || 'auto';

      if (preferredPosition === 'auto') {
        // Lógica automática para encontrar la mejor posición
        const spaceTop = targetRect.top;
        const spaceBottom = viewport.height - targetRect.bottom;
        const spaceLeft = targetRect.left;
        const spaceRight = viewport.width - targetRect.right;

        if (spaceBottom >= tooltipRect.height + margin) {
          newPosition.position = 'bottom';
        } else if (spaceTop >= tooltipRect.height + margin) {
          newPosition.position = 'top';
        } else if (spaceRight >= tooltipRect.width + margin) {
          newPosition.position = 'right';
        } else {
          newPosition.position = 'left';
        }
      } else {
        newPosition.position = preferredPosition;
      }

      // Calcular posición basada en la posición determinada
      switch (newPosition.position) {
        case 'top':
          newPosition.top =
            targetRect.top - tooltipRect.height - margin + offset.y;
          newPosition.left =
            targetRect.left +
            (targetRect.width - tooltipRect.width) / 2 +
            offset.x;
          break;
        case 'bottom':
          newPosition.top = targetRect.bottom + margin + offset.y;
          newPosition.left =
            targetRect.left +
            (targetRect.width - tooltipRect.width) / 2 +
            offset.x;
          break;
        case 'left':
          newPosition.top =
            targetRect.top +
            (targetRect.height - tooltipRect.height) / 2 +
            offset.y;
          newPosition.left =
            targetRect.left - tooltipRect.width - margin + offset.x;
          break;
        case 'right':
          newPosition.top =
            targetRect.top +
            (targetRect.height - tooltipRect.height) / 2 +
            offset.y;
          newPosition.left = targetRect.right + margin + offset.x;
          break;
      }

      // Ajustar para mantener dentro del viewport
      newPosition.left = Math.max(
        margin,
        Math.min(newPosition.left, viewport.width - tooltipRect.width - margin)
      );
      newPosition.top = Math.max(
        margin,
        Math.min(newPosition.top, viewport.height - tooltipRect.height - margin)
      );

      setPosition(newPosition);
    };

    // Actualizar posición inmediatamente y en resize/scroll
    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, currentStep, currentStepData]);

  // Highlight del elemento objetivo
  useEffect(() => {
    if (!isOpen || !targetElement) return;

    const originalStyle = {
      position: targetElement.style.position,
      zIndex: targetElement.style.zIndex,
      boxShadow: targetElement.style.boxShadow,
      transition: targetElement.style.transition,
    };

    // Aplicar estilos de highlight
    targetElement.style.position = targetElement.style.position || 'relative';
    targetElement.style.zIndex = '1002';
    targetElement.style.boxShadow =
      '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)';
    targetElement.style.transition = 'box-shadow 0.3s ease';

    return () => {
      // Restaurar estilos originales
      Object.assign(targetElement.style, originalStyle);
    };
  }, [isOpen, targetElement]);

  if (!isOpen || !currentStepData) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const tourContent = (
    <>
      {/* Overlay */}
      <div className='fixed inset-0 bg-black/50 z-[1000]' onClick={onClose} />

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className={`fixed z-[1002] w-[360px] max-w-[90vw] shadow-2xl border-2 ${className}`}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>{currentStepData.title}</CardTitle>

            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={onClose}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>

        <CardContent className='pt-0 pb-2'>
          <p className='text-sm text-muted-foreground mb-4'>
            {currentStepData.description}
          </p>

          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onPrevious}
                disabled={isFirstStep}
                className='flex items-center gap-1'
              >
                <ChevronLeft className='h-4 w-4' />
                Anterior
              </Button>

              <Button
                size='sm'
                onClick={isLastStep ? onClose : onNext}
                className='flex items-center gap-1'
              >
                {isLastStep ? 'Finalizar' : 'Siguiente'}
                {!isLastStep && <ChevronRight className='h-4 w-4' />}
              </Button>
            </div>

            {showSkip && onSkip && !isLastStep && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onSkip}
                className='flex items-center gap-1 text-muted-foreground'
              >
                <SkipForward className='h-4 w-4' />
                Saltar
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className='pb-2'>
          {showStepNumbers && (
            <Badge variant='secondary' className='text-xs mx-auto'>
              {currentStep + 1} de {steps.length}
            </Badge>
          )}
        </CardFooter>

        {/* Arrow indicator */}
        <div
          className={`absolute w-3 h-3 bg-background border-2 border-border rotate-45 ${
            position.position === 'top'
              ? 'bottom-[-8px] left-1/2 -translate-x-1/2'
              : position.position === 'bottom'
              ? 'top-[-8px] left-1/2 -translate-x-1/2'
              : position.position === 'left'
              ? 'right-[-8px] top-1/2 -translate-y-1/2'
              : 'left-[-8px] top-1/2 -translate-y-1/2'
          }`}
        />
      </Card>
    </>
  );

  return createPortal(tourContent, document.body);
}
