import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cuit } = req.query;

  // Simulación de datos. Reemplazar con lógica real de verificación.
  const mockData = {
    cuit: '20304050607',
    status: 'approved',
    licenseData: {
      tramiteNumber: '123456',
      registrationNumber: '78910',
      businessName: 'Empresa Ejemplo S.A.',
      cuit: '20304050607',
      regime: 'General',
      status: 'approved',
      validUntil: '31/12/2025',
      mainActivity: 'Comercio Minorista',
      otherActivities: ['Venta Online', 'Consultoría'],
      issueDate: '23/04/2025',
    },
  };

  if (cuit === mockData.cuit) {
    res.status(200).json(mockData);
  } else {
    res.status(404).json({ status: 'not_found' });
  }
}
