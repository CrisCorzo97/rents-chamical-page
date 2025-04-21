'use client';

import { AffidavitsWithRelations } from '../affidavits.interface';
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import locale from 'dayjs/locale/es';

dayjs.locale(locale);

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    textDecoration: 'underline',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
    fontSize: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1pt solid #e0e0e0',
    padding: 2,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 2,
  },
  total: {
    textAlign: 'right',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

interface AffidavitsReportClientProps {
  data: AffidavitsWithRelations[] | null;
}

const AffidavitsReport = ({ data }: { data: AffidavitsWithRelations[] }) => {
  // Agrupar affidavits por estado
  const paidAffidavits = data.filter(
    (a) => a.status === 'approved' || a.status === 'under_review'
  );
  const unpaidAffidavits = data.filter(
    (a) => a.status === 'pending_payment' || a.status === 'refused'
  );

  // Calcular totales
  const totalPaid = paidAffidavits.reduce((sum, a) => sum + a.fee_amount, 0);
  const totalUnpaid = unpaidAffidavits.reduce(
    (sum, a) => sum + a.fee_amount,
    0
  );

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <Text style={styles.title}>Informe de Declaraciones Juradas</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Fecha: {dayjs().format('DD/MM/YYYY')}
        </Text>

        {/* Sección de affidavits pagadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Declaraciones Pagadas</Text>
          <View style={styles.table}>
            {/* Encabezados de la tabla */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>CUIT</Text>
              <Text style={styles.tableCell}>Contribuyente</Text>
              <Text style={styles.tableCell}>Período</Text>
              <Text style={styles.tableCell}>Importe</Text>
            </View>
            {/* Filas de datos */}
            {paidAffidavits.map((affidavit) => (
              <View key={affidavit.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{affidavit.tax_id}</Text>
                <Text style={styles.tableCell}>
                  {`${formatName(
                    affidavit.user?.first_name ?? '-'
                  )} ${formatName(affidavit.user?.last_name ?? '')}`}
                </Text>
                <Text style={styles.tableCell}>
                  {dayjs(affidavit.period).format('MM/YYYY')}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumberToCurrency(affidavit.fee_amount)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>
            Total Pagado: {formatNumberToCurrency(totalPaid)}
          </Text>
        </View>

        {/* Sección de affidavits no pagadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Declaraciones Pendientes de Pago
          </Text>
          <View style={styles.table}>
            {/* Encabezados de la tabla */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>CUIT</Text>
              <Text style={styles.tableCell}>Contribuyente</Text>
              <Text style={styles.tableCell}>Período</Text>
              <Text style={styles.tableCell}>Importe</Text>
            </View>
            {/* Filas de datos */}
            {unpaidAffidavits.map((affidavit) => (
              <View key={affidavit.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{affidavit.tax_id}</Text>
                <Text style={styles.tableCell}>
                  {`${formatName(
                    affidavit.user?.first_name ?? '-'
                  )} ${formatName(affidavit.user?.last_name ?? '')}`}
                </Text>
                <Text style={styles.tableCell}>
                  {dayjs(affidavit.period).format('MM/YYYY')}
                </Text>
                <Text style={styles.tableCell}>
                  {formatNumberToCurrency(affidavit.fee_amount)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.total}>
            Total Pendiente: {formatNumberToCurrency(totalUnpaid)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export function AffidavitsReportClient({ data }: AffidavitsReportClientProps) {
  if (!data) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <AffidavitsReport data={data} />
      </PDFViewer>
    </div>
  );
}
