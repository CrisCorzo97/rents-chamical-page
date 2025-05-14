'use client';

import { useEffect, useState } from 'react';
import { DailyBoxReportPDF } from '../components/dailyBoxReportPDF';
import { DailyBoxContent } from '../components/dailyBoxReport';
import { PDFViewer } from '@react-pdf/renderer';

interface ReportDataForPreview {
  content: DailyBoxContent;
  date: string;
}

export default function DailyBoxPreviewPage() {
  const [reportData, setReportData] = useState<ReportDataForPreview | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('dailyBoxReportDataForPreview');
      if (storedData) {
        const parsedData: ReportDataForPreview = JSON.parse(storedData);
        setReportData(parsedData);
        // Opcional: Limpiar el sessionStorage después de leerlo para que no persista innecesariamente
        // sessionStorage.removeItem('dailyBoxReportDataForPreview');
      } else {
        setError(
          'No se encontraron datos para generar el reporte. Por favor, intente generar el reporte nuevamente.'
        );
      }
    } catch (e) {
      console.error(
        'Error al parsear datos del reporte desde sessionStorage:',
        e
      );
      setError(
        'Error al cargar los datos del reporte. Verifique la consola para más detalles.'
      );
    }
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'red',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!reportData) {
    // Este estado de carga es principalmente para la fase de obtención de datos de sessionStorage.
    // El DynamicPDFViewer tiene su propio estado de carga para la librería PDF en sí.
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
        }}
      >
        Cargando datos del reporte...
      </div>
    );
  }

  return (
    <section className='w-full h-admin-scroll-area'>
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <DailyBoxReportPDF
          data={{ ...reportData.content, date: reportData.date }}
        />
      </PDFViewer>
    </section>
  );
}
