/* eslint-disable jsx-a11y/alt-text */
import { formatName, formatNumberToCurrency } from '@/lib/formatters';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { DailyBoxContent } from './dailyBoxReport';

// Create styles
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: '30px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    alignItems: 'center',
    width: '100%',
  },
  headerLogo: {
    width: '60px',
    height: '60px',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  contentTitle: {
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  contentTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  contentTableHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    padding: '2px 6px',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
  },
  contentTableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentTableBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  contentTableBodyRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    padding: '2px 6px',
    justifyContent: 'space-around',
  },
  contentTableBodyCell: {
    fontSize: 9,
    lineHeight: '12px',
    maxLines: 1,
  },
  footer: {
    position: 'absolute',
    top: '85%',
    left: 30,
    right: 30,
    bottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '6px',
  },
  footerBorder: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: '6px',
  },
  footerTotalRow: {
    width: '100%',
    gap: '6px',
    padding: '0px 6px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#f0f0f0',
  },
  footerTotalCell: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export interface ReceiptPDFProps {
  data: DailyBoxContent & {
    date: string;
  };
}

// Create Document Component
export const DailyBoxReportPDF = ({ data }: ReceiptPDFProps) => {
  return (
    <Document
      title='Caja diaria'
      author='Municipalidad de Chamical'
      subject='Rentas Municipal'
      language='es'
    >
      {data.page_data?.length ? (
        data.page_data.map((page) => (
          <PageComponent
            key={page.page}
            date={data.date}
            page={page.page}
            subtotal={page.subtotal}
            receipts={page.receipts}
            tax_summary={data.tax_summary}
            total_items={page.total_items}
            totalPages={data.page_data.length}
            totalAmountCollected={data.total_amount_collected}
          />
        ))
      ) : (
        <PageComponent
          key='empty-page'
          date={data.date}
          page={1}
          subtotal={0}
          receipts={[]}
          tax_summary={data.tax_summary}
          total_items={data.total_receipts}
          totalPages={1}
          totalAmountCollected={data.total_amount_collected}
        />
      )}
      {data.tax_summary.add_new_page && (
        <PageComponent
          key='tax-summary'
          date={data.date}
          page={data.page_data.length + 1}
          subtotal={0}
          receipts={[]}
          tax_summary={data.tax_summary}
          total_items={data.total_receipts}
          totalPages={data.page_data.length}
          totalAmountCollected={data.total_amount_collected}
        />
      )}
    </Document>
  );
};

const PageComponent = (details: {
  date: string;
  page: number;
  subtotal: number;
  receipts: {
    id: string;
    paid_at: Date;
    taxpayer: string;
    tax_type: string;
    amount: number;
  }[];
  tax_summary: DailyBoxContent['tax_summary'];
  total_items: number;
  totalPages: number;
  totalAmountCollected: number;
}) => {
  const { tax_summary } = details;

  const showTaxSummary = tax_summary.add_new_page
    ? details.page === details.totalPages + 1
    : details.page === details.totalPages;

  const taxSummaryItems = Object.entries(tax_summary.details ?? {});

  return (
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <Image
          src='https://apkomtlxqddpzutagjvn.supabase.co/storage/v1/object/public/visual-resourses/Escudo%20de%20Chamical.jpg'
          style={styles.headerLogo}
        />
        <View style={styles.headerTitle}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            Municipalidad Departamento Chamical
          </Text>
          <Text
            style={{
              fontSize: 16,
            }}
          >
            Chamical - La Rioja
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentTitle}>
          RESUMEN DE CAJA DIARIA {dayjs(details.date).format('DD/MM/YYYY')}
        </Text>
        <View style={styles.contentTable}>
          {(!tax_summary.add_new_page || !showTaxSummary) && (
            <View>
              <View style={styles.contentTableHeader}>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '10%' }}
                >
                  Hora
                </Text>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '15%' }}
                >
                  Comprobante
                </Text>
                <Text
                  style={{
                    ...styles.contentTableHeaderCell,
                    width: '30%',
                  }}
                >
                  Contribuyente
                </Text>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '30%' }}
                >
                  Tasa
                </Text>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '15%' }}
                >
                  Importe
                </Text>
              </View>
              <View>
                {details.receipts?.length ? (
                  details.receipts.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        ...styles.contentTableBodyRow,
                        backgroundColor: index % 2 === 0 ? 'white' : '#f6f6f6',
                      }}
                    >
                      <Text
                        style={{ ...styles.contentTableBodyCell, width: '10%' }}
                      >
                        {dayjs(item.paid_at).format('HH:mm')}hs
                      </Text>
                      <Text
                        style={{ ...styles.contentTableBodyCell, width: '15%' }}
                      >
                        {item.id}
                      </Text>
                      <Text
                        style={{
                          ...styles.contentTableBodyCell,
                          width: '30%',
                        }}
                      >
                        {formatName(item.taxpayer)}
                      </Text>
                      <Text
                        style={{ ...styles.contentTableBodyCell, width: '30%' }}
                      >
                        {formatName(item.tax_type)}
                      </Text>
                      <Text
                        style={{ ...styles.contentTableBodyCell, width: '15%' }}
                      >
                        {formatNumberToCurrency(item.amount)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ ...styles.contentTableBodyCell }}>
                    No hay comprobantes confirmados en esta fecha.
                  </Text>
                )}
              </View>
            </View>
          )}

          {taxSummaryItems.length && showTaxSummary && (
            <View>
              <View
                style={{
                  ...styles.contentTableHeader,
                  marginTop: tax_summary.add_new_page ? 0 : 10,
                }}
              >
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '85%' }}
                >
                  Tasa / Contribución
                </Text>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '15%' }}
                >
                  Importe
                </Text>
              </View>
              <View>
                {taxSummaryItems.map(([tax, amount], index) => (
                  <View
                    key={tax}
                    style={{
                      ...styles.contentTableBodyRow,
                      backgroundColor: index % 2 === 0 ? 'white' : '#f6f6f6',
                    }}
                  >
                    <Text
                      style={{
                        ...styles.contentTableBodyCell,
                        width: '85%',
                      }}
                    >
                      {formatName(tax)}
                    </Text>
                    <Text
                      style={{
                        ...styles.contentTableBodyCell,
                        width: '15%',
                      }}
                    >
                      $
                      {amount.toLocaleString('es-AR', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View>
          <View style={styles.footerBorder}></View>
          {showTaxSummary && (
            <View style={styles.footerTotalRow}>
              <Text
                style={{
                  ...styles.footerTotalCell,
                  width: '25%',
                  textAlign: 'right',
                }}
              >
                TOTAL:
              </Text>
              <Text
                style={{
                  ...styles.footerTotalCell,
                  width: '15%',
                }}
              >
                $
                {details.totalAmountCollected.toLocaleString('es-AR', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            width: '100%',
            fontSize: 10,
            textAlign: 'right',
          }}
        >
          {`Página ${details.page} de ${
            tax_summary.add_new_page
              ? details.totalPages + 1
              : details.totalPages
          }`}
        </Text>
      </View>
    </Page>
  );
};
