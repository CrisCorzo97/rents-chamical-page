'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ResultContextType {
  result: boolean;
  setFnResult: (result: {
    success: boolean;
    showComponent: boolean;
    component: ReactNode;
  }) => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<boolean>(false);
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [component, setComponent] = useState<ReactNode>(null);

  const setFnResult = (result: {
    success: boolean;
    showComponent: boolean;
    component?: ReactNode;
  }) => {
    const { success, component, showComponent } = result;

    setShowComponent(showComponent);
    setResult(success);
    setComponent(component);
  };

  return (
    <ResultContext.Provider value={{ result, setFnResult }}>
      {children}

      {showComponent && component}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResult must be used within a ResultProvider');
  }
  return context;
};
