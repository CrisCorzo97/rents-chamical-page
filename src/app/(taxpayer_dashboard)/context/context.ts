import { createContext } from 'react';
import { TaxpayerData } from '../types/types';

export const TaxpayerDataContext = createContext<TaxpayerData | null>(null);
