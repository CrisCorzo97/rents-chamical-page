/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '40px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  receipt: {
    width: '100%',
    padding: '8px',
    border: '1px solid black',
    borderRadius: '8px',
  },
  headerReceipt: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    alignItems: 'center',
  },
  logoTextContainer: {
    width: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  logo: {
    width: '60px',
    height: '60px',
    marginBottom: '8px',
  },
  receiptIdContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
    marginRight: '16px',
    marginTop: '8px',
  },
  bodyReceipt: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  bodyTitle: {
    width: '65%',
    margin: '0 auto',
    marginBottom: '8px',
    backgroundColor: '#E4E4E4',
    padding: '4px 6px',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bodyLine: {
    margin: '0 32px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '4px',
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
export const ReceiptPFD = () => {
  // crear buffer de imagen
  // const imageBuffer = Buffer.from(
  //   'https://apkomtlxqddpzutagjvn.supabase.co/storage/v1/object/public/visual-resourses/Escudo%20de%20Chamical.jpg',
  //   'base64'
  // );

  return (
    <Document
      title='Comprobante de pago de patente'
      author='Municipalidad de Chamical'
      subject='Rentas Municipal'
      language='es'
    >
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <View style={styles.receipt}>
            <View style={styles.headerReceipt}>
              <View style={styles.logoContainer}>
                <Image
                  src='https://apkomtlxqddpzutagjvn.supabase.co/storage/v1/object/public/visual-resourses/Escudo%20de%20Chamical.jpg'
                  style={styles.logo}
                />
                <View style={styles.logoTextContainer}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 'ultrabold',
                    }}
                  >
                    Municipalidad Departamento Chamical
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 'normal',
                    }}
                  >
                    Chamical - La Rioja
                  </Text>
                </View>
              </View>
              <View style={styles.receiptIdContainer}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: 'bold',
                  }}
                >
                  PATENTE
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2px',
                    backgroundColor: '#E4E4E4',
                    padding: '4px 6px',
                  }}
                >
                  <Text
                    style={{
                      fontSize: '13px',
                      fontWeight: 'semibold',
                    }}
                  >
                    N°:
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 'normal',
                    }}
                  >
                    30-00000000-0
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.bodyReceipt}>
              <Text style={styles.bodyTitle}>
                PATENTE AUTOMOTOR Y/O MOTOVEHÍCULO
              </Text>
              <View style={styles.bodyLine}>
                <View
                  style={{
                    flex: '1 1 100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Dominio:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 70%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    ABC 123
                  </Text>
                </View>
                <View
                  style={{
                    flex: '1 1 100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Vehículo:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 70%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    Gol
                  </Text>
                </View>
                <View
                  style={{
                    flex: '1 1 100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Marca:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 70%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    Volkswagen
                  </Text>
                </View>
              </View>
              <View style={styles.bodyLine}>
                <View
                  style={{
                    flex: '1 1 100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Titular:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 100%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    Juan Pérez
                  </Text>
                </View>
                <View
                  style={{
                    flex: '1 1 50%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    D.N.I.:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 90%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    23.571.481
                  </Text>
                </View>
              </View>
              <View style={styles.bodyLine}>
                <View
                  style={{
                    flex: '1 1 40%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Año pagado:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 40%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    2024
                  </Text>
                </View>
                <View
                  style={{
                    flex: '1 1 100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Detalle:
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 90%',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    Tenía saldo a favor...
                  </Text>
                </View>
              </View>
              <View style={{ ...styles.bodyLine, width: '60%' }}>
                <View
                  style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Chamical, La Rioja
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 auto',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    16
                  </Text>
                </View>
                <View
                  style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    de
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 auto',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    Septiembre
                  </Text>
                </View>
                <View
                  style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    fontSize: '11px',
                    fontWeight: 'normal',
                  }}
                >
                  <Text
                    style={{
                      flex: '1 1 auto',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    de
                  </Text>
                  <Text
                    style={{
                      flex: '1 1 auto',
                      borderBottom: '1px dashed black',
                    }}
                  >
                    2024
                  </Text>
                </View>
              </View>
            </View>
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
};
