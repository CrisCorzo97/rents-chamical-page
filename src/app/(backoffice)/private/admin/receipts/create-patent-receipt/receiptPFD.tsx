/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '40px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  receipt: {
    height: '200px',
    width: '100%',
    padding: '12px',
    border: '1px solid black',
    borderRadius: '8px',
  },
  footerReceipt: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  footerReceiptText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#000000',
  },
  footerReceiptCutLine: {
    width: '100%',
    height: '1px',
    borderTop: '1px',
    borderStyle: 'dashed',
    marginTop: '4px',
  },
});

// Create Document Component
export const ReceiptPFD = () => (
  <Document
    title='Comprobante de pago de patente'
    author='Municipalidad de Chamical'
    subject='Rentas Municipal'
    language='es'
  >
    <Page size='A4' style={styles.page}>
      <View style={styles.section}>
        <View style={styles.receipt}>
          <Text>Comprobante de pago de patente</Text>
          <Text>Fecha: 01/01/2021</Text>
        </View>
        <View style={styles.footerReceipt}>
          <Text style={styles.footerReceiptText}>
            Talón para el contribuyente
          </Text>
          <View style={styles.footerReceiptCutLine}></View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.receipt}>
          <Text>Comprobante de pago de patente</Text>
          <Text>Fecha: 01/01/2021</Text>
        </View>
        <View style={styles.footerReceipt}>
          <Text style={styles.footerReceiptText}>
            Talón para el Tribunal de Cuentas
          </Text>
          <View style={styles.footerReceiptCutLine}></View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.receipt}>
          <Text>Comprobante de pago de patente</Text>
          <Text>Fecha: 01/01/2021</Text>
        </View>
        <View style={styles.footerReceipt}>
          <Text style={styles.footerReceiptText}>
            Talón para la Municipalidad
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
