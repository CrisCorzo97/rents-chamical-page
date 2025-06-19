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
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    paddingRight: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    width: '100%',
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },
  contentTitle: {
    fontSize: 14,
    lineHeight: 1.3,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  contentTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: '100%',
  },
  contentTableHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
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
    gap: 8,
  },
  contentTableBodyRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    padding: '2px 6px',
    justifyContent: 'space-around',
  },
  contentTableBodyCell: {
    fontSize: 9,
    lineHeight: 1.3,
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
  const numDataPagesActual = data.page_data?.length || 0;
  const wantsSeparateSummaryPage = data.tax_summary.add_new_page;

  let effectiveTotalPages = numDataPagesActual;
  if (wantsSeparateSummaryPage) {
    effectiveTotalPages += 1;
  }
  // If there are no data pages, there's always at least one PDF page
  // (either for "no data, summary on this page" or "dedicated summary page if no data")
  if (numDataPagesActual === 0) {
    effectiveTotalPages = Math.max(1, effectiveTotalPages);
  }

  return (
    <Document
      title='Caja diaria'
      author='Municipalidad de Chamical'
      subject='Rentas Municipal'
      language='es'
    >
      {/* Render Data Pages */}
      {numDataPagesActual > 0 &&
        data.page_data.map((pageContent) => (
          <PageComponent
            key={`data-${pageContent.page}`}
            date={data.date}
            currentPageNumber={pageContent.page}
            totalPagesInDocument={effectiveTotalPages}
            receipts={pageContent.receipts}
            tax_summary_details={data.tax_summary.details}
            showSummaryOnThisPage={
              !wantsSeparateSummaryPage &&
              pageContent.page === numDataPagesActual
            }
            totalAmountCollectedAllPages={data.total_amount_collected}
            isThisADedicatedSummaryPage={false}
          />
        ))}

      {/* Render Empty Page (if no data pages AND summary is not separate) */}
      {numDataPagesActual === 0 && !wantsSeparateSummaryPage && (
        <PageComponent
          key='empty-with-summary'
          date={data.date}
          currentPageNumber={1}
          totalPagesInDocument={1} // Only one page in this scenario
          receipts={[]}
          tax_summary_details={data.tax_summary.details}
          showSummaryOnThisPage={true} // Summary is shown on this only page
          totalAmountCollectedAllPages={data.total_amount_collected}
          isThisADedicatedSummaryPage={false} // Not "dedicated" as it also states "no data"
        />
      )}

      {/* Render Dedicated Summary Page (if requested, and might be the only page if no data) */}
      {wantsSeparateSummaryPage && (
        <PageComponent
          key='dedicated-summary'
          date={data.date}
          currentPageNumber={numDataPagesActual + 1} // Page number after data pages (or 1 if no data pages)
          totalPagesInDocument={effectiveTotalPages}
          receipts={[]} // No individual receipts on a dedicated summary page
          tax_summary_details={data.tax_summary.details}
          showSummaryOnThisPage={true} // This page IS for the summary
          totalAmountCollectedAllPages={data.total_amount_collected}
          isThisADedicatedSummaryPage={true}
        />
      )}
    </Document>
  );
};

interface PageComponentProps {
  date: string;
  currentPageNumber: number;
  totalPagesInDocument: number;
  receipts: {
    id: string;
    paid_at: Date;
    taxpayer: string;
    tax_type: string;
    amount: number;
  }[];
  tax_summary_details: Record<string, number>;
  showSummaryOnThisPage: boolean;
  totalAmountCollectedAllPages: number;
  isThisADedicatedSummaryPage: boolean;
}

const PageComponent = ({
  date,
  currentPageNumber,
  totalPagesInDocument,
  receipts,
  tax_summary_details,
  showSummaryOnThisPage,
  totalAmountCollectedAllPages,
  isThisADedicatedSummaryPage,
}: PageComponentProps) => {
  const taxSummaryItems = Object.entries(tax_summary_details ?? {});

  const displayReceiptsTable =
    !isThisADedicatedSummaryPage && receipts && receipts.length > 0;
  const displayEmptyReceiptsMessage =
    !isThisADedicatedSummaryPage && (!receipts || receipts.length === 0);

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
          RESUMEN DE CAJA DIARIA {dayjs(date).format('DD/MM/YYYY')}
        </Text>
        <View style={styles.contentTable}>
          {(displayReceiptsTable || displayEmptyReceiptsMessage) && (
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
                    width: '25%',
                  }}
                >
                  Contribuyente
                </Text>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '35%' }}
                >
                  Concepto
                </Text>
                <Text
                  style={{ ...styles.contentTableHeaderCell, width: '15%' }}
                >
                  Importe
                </Text>
              </View>
              <View>
                {displayReceiptsTable &&
                  receipts.map((item, index) => (
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
                          width: '25%',
                        }}
                      >
                        {formatName(item.taxpayer)}
                      </Text>
                      <Text
                        style={{ ...styles.contentTableBodyCell, width: '35%' }}
                      >
                        {formatName(item.tax_type)}
                      </Text>
                      <Text
                        style={{ ...styles.contentTableBodyCell, width: '15%' }}
                      >
                        {formatNumberToCurrency(item.amount || 0)}
                      </Text>
                    </View>
                  ))}
                {displayEmptyReceiptsMessage && (
                  <Text
                    style={{
                      ...styles.contentTableBodyCell,
                      textAlign: 'center',
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    No hay comprobantes confirmados en esta fecha.
                  </Text>
                )}
              </View>
            </View>
          )}

          {taxSummaryItems.length > 0 && showSummaryOnThisPage && (
            <View>
              <View
                style={{
                  ...styles.contentTableHeader,
                  marginTop:
                    isThisADedicatedSummaryPage &&
                    !displayReceiptsTable &&
                    !displayEmptyReceiptsMessage
                      ? 0
                      : 10,
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
                      {formatNumberToCurrency(amount || 0)}
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
          {showSummaryOnThisPage && ( // Show total only if summary is shown on this page
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
                {formatNumberToCurrency(totalAmountCollectedAllPages || 0)}
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
          {`Página ${currentPageNumber} de ${totalPagesInDocument}`}
        </Text>
      </View>
    </Page>
  );
};
