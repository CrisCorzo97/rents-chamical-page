'use client';
import { useContext } from 'react';
import { TaxpayerDataContext } from '../context/context';
import { TaxpayerData } from '../types/types';

export const useTaxpayerContext = () => {
  const context = useContext(TaxpayerDataContext);
  if (!context) {
    throw new Error(
      'useTaxpayerContext must be used within a TaxpayerDataProvider'
    );
  }
  return context;
};

export const TaxpayerDataProvider = ({
  taxpayerData,
  children,
}: {
  children: React.ReactNode;
  taxpayerData: TaxpayerData;
}) => {
  return (
    <TaxpayerDataContext.Provider value={taxpayerData}>
      {children}
    </TaxpayerDataContext.Provider>
  );
};
