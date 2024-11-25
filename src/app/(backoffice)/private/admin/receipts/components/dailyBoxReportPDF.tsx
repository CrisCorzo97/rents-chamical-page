/* eslint-disable jsx-a11y/alt-text */
import { receipt } from '@prisma/client';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import 'dayjs/locale/es';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '30px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  header: {},
  content: {},
  footer: {},
});

export interface ReceiptPDFProps {
  data: receipt[];
}

// Create Document Component
export const ReceiptPDF = ({ data }: ReceiptPDFProps) => {
  return (
    <Document
      title='Caja diaria'
      author='Municipalidad de Chamical'
      subject='Rentas Municipal'
      language='es'
    >
      <Page size='A4' style={styles.page}>
        <View style={styles.header}></View>
        <View style={styles.content}></View>
        <View style={styles.footer}></View>
      </Page>
    </Document>
  );
};
