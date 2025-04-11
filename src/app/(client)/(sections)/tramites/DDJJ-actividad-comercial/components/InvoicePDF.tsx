/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { generateBarcodeBase64 } from '@/lib/code-generator';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  headerBox: {
    border: 1,
    borderColor: '#000000',
    marginBottom: 2,
    padding: 8,
  },
  municipalityName: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 9,
    textAlign: 'center',
  },
  invoiceBox: {
    border: 1,
    borderColor: '#000000',
    marginBottom: 2,
    padding: 8,
  },
  invoiceTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  taxpayerBox: {
    border: 1,
    borderColor: '#000000',
    marginBottom: 2,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  taxpayerInfo: {
    fontSize: 9,
    marginBottom: 3,
  },
  detailsBox: {
    border: 1,
    borderColor: '#000000',
    marginBottom: 2,
    flexGrow: 1,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    borderBottom: 1,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderStyle: 'solid',
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontSize: 9,
    padding: 4,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 9,
    padding: 4,
  },
  columnConcept: {
    width: '50%',
    borderRight: 1,
  },
  columnPeriod: {
    width: '30%',
    borderRight: 1,
  },
  columnAmount: {
    width: '20%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottom: 1,
    fontSize: 10,
    fontWeight: 'bold',
  },
  dueDate: {
    padding: 8,
    fontSize: 9,
  },
  paymentBox: {
    border: 1,
    borderColor: '#000000',
    padding: 8,
    flexDirection: 'row',
    marginTop: 'auto',
  },
  paymentInstructions: {
    flex: 3,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  barcodeSection: {
    flex: 2,
  },
  barcode: {
    width: '100%',
    height: 40,
    marginTop: 'auto',
  },
});

interface InvoiceItem {
  concept: string;
  period: string;
  amount: number;
}

interface MunicipalInvoiceProps {
  invoiceData: {
    invoiceId: string;
    date: string;
    taxpayerName: string;
    taxpayerId: string;
    address: string;
    items: InvoiceItem[];
    dueDate: string;
    paymentInfo: {
      bank: string;
      cbu: string;
      alias: string;
      cuit: string;
    };
  };
}

const MunicipalInvoice: React.FC<MunicipalInvoiceProps> = ({ invoiceData }) => {
  const [barcodeUrl, setBarcodeUrl] = React.useState('');

  React.useEffect(() => {
    const generateBarcode = () => {
      try {
        const barcodeData = `${invoiceData.paymentInfo.cuit}|${
          invoiceData.invoiceId
        }|${invoiceData.taxpayerId}|${invoiceData.items
          .reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2)}|${invoiceData.dueDate.replace(/\//g, '')}`;
        const url = generateBarcodeBase64(barcodeData);
        setBarcodeUrl(url);
      } catch (err) {
        console.error('Error generating barcode:', err);
      }
    };

    generateBarcode();
  }, [invoiceData]);

  const total = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.headerBox}>
          <Text style={styles.municipalityName}>MUNICIPALIDAD DE CHAMICAL</Text>
          <Text style={styles.contactInfo}>
            Dirección: Av. Perón 1200 - Chamical, La Rioja, Argentina
          </Text>
          <Text style={styles.contactInfo}>
            Tel: (3826) 416199 | Email: dir.rentas.chami@gamail.com
          </Text>
        </View>

        <View style={styles.invoiceBox}>
          <Text style={styles.invoiceTitle}>FACTURA MUNICIPAL</Text>
          <View style={styles.invoiceRow}>
            <Text>N°: {invoiceData.invoiceId}</Text>
            <Text>Fecha emisión: {invoiceData.date}</Text>
          </View>
        </View>

        <View style={styles.taxpayerBox}>
          <Text style={styles.sectionTitle}>DATOS DEL CONTRIBUYENTE</Text>
          <Text style={styles.taxpayerInfo}>Nombre/Razón Social</Text>
          <Text style={styles.taxpayerInfo}>{invoiceData.taxpayerName}</Text>
          <Text style={styles.taxpayerInfo}>
            CUIT: {invoiceData.taxpayerId}
          </Text>
          <Text style={styles.taxpayerInfo}>
            Domicilio Fiscal: {invoiceData.address}
          </Text>
        </View>

        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>DETALLE DE CONCEPTOS</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableHeader, styles.columnConcept]}>
                <Text>Concepto</Text>
              </View>
              <View style={[styles.tableHeader, styles.columnPeriod]}>
                <Text>Período</Text>
              </View>
              <View style={[styles.tableHeader, styles.columnAmount]}>
                <Text>Importe</Text>
              </View>
            </View>
            {invoiceData.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.columnConcept]}>
                  <Text>{item.concept}</Text>
                </View>
                <View style={[styles.tableCell, styles.columnPeriod]}>
                  <Text>{item.period}</Text>
                </View>
                <View style={[styles.tableCell, styles.columnAmount]}>
                  <Text>$ {item.amount.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.totalRow}>
            <Text>TOTAL A PAGAR: $ {total.toFixed(2)}</Text>
          </View>
          <View style={styles.dueDate}>
            <Text>Vencimiento: {invoiceData.dueDate}</Text>
          </View>
        </View>

        <View style={styles.paymentBox}>
          <View style={styles.paymentInstructions}>
            <Text style={styles.paymentTitle}>INSTRUCCIONES DE PAGO</Text>
            <Text style={styles.paymentInfo}>Via transferencia</Text>
            <Text style={styles.paymentInfo}>
              Banco: {invoiceData.paymentInfo.bank}
            </Text>
            <Text style={styles.paymentInfo}>
              CBU: {invoiceData.paymentInfo.cbu}
            </Text>
            <Text style={styles.paymentInfo}>
              Alias: {invoiceData.paymentInfo.alias}
            </Text>
            <Text style={styles.paymentInfo}>
              CUIT: {invoiceData.paymentInfo.cuit}
            </Text>
          </View>
          <View style={styles.barcodeSection}>
            {barcodeUrl && <Image style={styles.barcode} src={barcodeUrl} />}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MunicipalInvoice;
