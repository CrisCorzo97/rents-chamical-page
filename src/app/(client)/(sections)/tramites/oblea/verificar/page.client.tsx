'use client';

import { LicenseData } from '../oblea.actions';
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import {
  SuccessfulVerifyObleaIllustration,
  ErrorVerifyObleaIllustration,
} from '@/assets/illustrations';

interface PageClientProps {
  status: 'valid' | 'invalid';
  licenseData: LicenseData | null;
  error: string | null;
}

export const PageClient = ({ status, licenseData, error }: PageClientProps) => {
  return (
    <>
      {status === 'valid' && licenseData && (
        <Card className='mt-4 max-w-xl'>
          <CardHeader className='flex flex-col items-center'>
            <CardTitle className='mb-6'>Comercio Habilitado</CardTitle>
            <SuccessfulVerifyObleaIllustration className='w-48 h-48 mb-6' />
          </CardHeader>
          <CardContent>
            <p className='mb-2 text-gray-700'>
              <strong>Razón Social:</strong> {licenseData.businessName}
            </p>
            <p className='mb-2 text-gray-700'>
              <strong>CUIT:</strong> {licenseData.cuit}
            </p>
            <p className='mb-2 text-gray-700'>
              <strong>Contribuyente:</strong> {licenseData.taxpayerName}
            </p>
            <p className='mb-2 text-gray-700'>
              <strong>Actividad Principal:</strong> {licenseData.mainActivity}
            </p>
            {Array.isArray(licenseData.otherActivities) &&
              licenseData.otherActivities.length > 0 && (
                <p className='mb-2 text-gray-700'>
                  <strong>Otras Actividades:</strong>{' '}
                  {licenseData.otherActivities.join(', ')}
                </p>
              )}
            <p className='mb-2 text-gray-700'>
              <strong>Vigencia:</strong> {licenseData.validUntil}
            </p>
            <p className='mb-2 text-gray-700'>
              <strong>Fecha de Verificación:</strong> {licenseData.issueDate}
            </p>
          </CardContent>
        </Card>
      )}

      {status === 'invalid' && error && (
        <Card className='mt-4 max-w-xl'>
          <CardHeader className='flex flex-col items-center'>
            <CardTitle className='mb-6'>Comercio No Habilitado</CardTitle>
            <ErrorVerifyObleaIllustration className='w-48 h-48 mb-6' />
          </CardHeader>
          <CardContent>
            <Alert className='mt-4 mb-6 max-w-xl bg-red-50 border-red-500 text-red-600'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            {licenseData && (
              <>
                <p className='mb-2 text-gray-700'>
                  <strong>Razón Social:</strong> {licenseData.businessName}
                </p>
                <p className='mb-2 text-gray-700'>
                  <strong>CUIT:</strong> {licenseData.cuit}
                </p>
                <p className='mb-2 text-gray-700'>
                  <strong>Contribuyente:</strong> {licenseData.taxpayerName}
                </p>
                <p className='mb-2 text-gray-700'>
                  <strong>Actividad Principal:</strong>{' '}
                  {licenseData.mainActivity}
                </p>
                {Array.isArray(licenseData.otherActivities) &&
                  licenseData.otherActivities.length > 0 && (
                    <p className='mb-2 text-gray-700'>
                      <strong>Otras Actividades:</strong>{' '}
                      {licenseData.otherActivities.join(', ')}
                    </p>
                  )}
                <p className='mb-2 text-gray-700'>
                  <strong>Vigencia:</strong> {licenseData.validUntil}
                </p>
                <p className='mb-2 text-gray-700'>
                  <strong>Fecha de Verificación:</strong>{' '}
                  {licenseData.issueDate}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
