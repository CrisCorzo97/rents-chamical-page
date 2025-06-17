'use client';

import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import Tour, { type TourStep } from './tour';

interface TourContextType {
  startTour: (steps: TourStep[], tourName: string) => void;
  endTour: (tourName: string) => void;
  isActive: boolean;
  currentStep: number;
  tourName: string;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: React.ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [tourName, setTourName] = useState<string>('');

  const startTour = useCallback((tourSteps: TourStep[], tourName: string) => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsActive(true);
    setTourName(tourName);
  }, []);

  const endTour = useCallback((tourName: string) => {
    globalThis.localStorage.setItem(`tour-completed-${tourName}`, 'true');
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour(tourName);
    }
  }, [currentStep, steps.length, endTour, tourName]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    endTour(tourName);
  }, [endTour, tourName]);

  return (
    <TourContext.Provider
      value={{ startTour, endTour, isActive, currentStep, tourName }}
    >
      {children}
      <Tour
        steps={steps}
        currentStep={currentStep}
        isOpen={isActive}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onClose={() => endTour(tourName)}
        onSkip={handleSkip}
      />
    </TourContext.Provider>
  );
}
