/* eslint-disable jsx-a11y/alt-text */
import { formatCuilInput, formatName } from '@/lib/formatters';
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

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '30px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    padding: '6px',
    border: '1px solid black',
    borderRadius: '8px',
  },
  headerReceipt: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '4px',
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
    width: '50px',
    height: '50px',
  },
  receiptIdContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
    marginRight: '10px',
    marginTop: '4px',
  },
  bodyReceipt: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  bodyTitle: {
    width: '65%',
    margin: '0 auto',
    marginBottom: '4px',
    backgroundColor: '#E4E4E4',
    padding: '2px 4px',
    textAlign: 'center',
    fontSize: 11,
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
    width: '95%',
    margin: '0 auto',
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bottomReceipt: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    alignItems: 'center',
  },
  bottomReceiptText: {
    textAlign: 'center',
    fontSize: 8,
    color: '#000000',
  },
  bottomReceiptCutLine: {
    width: '100%',
    height: '1px',
    borderTop: '1px',
    borderStyle: 'dashed',
    marginTop: '2px',
  },
});

export interface ReceiptPDFProps {
  data: {
    receiptId: string;
    taxpayer: string;
    taxId: string;
    commercialActivity: string;
    companyName: string;
    address: string;
    addressNumber: number;
    neighborhood: string;
    yearToPay: number;
    observations: string;
    amount: number;
  };
}

// Create Document Component
export const ReceiptPDF = ({ data }: ReceiptPDFProps) => {
  return (
    <Document
      title='Comprobante de pago de habilitación comercial'
      author='Municipalidad de Chamical'
      subject='Rentas Municipal'
      language='es'
    >
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <Receipt data={data} />
          <View style={styles.bottomReceipt}>
            <Text style={styles.bottomReceiptText}>
              Talón para el contribuyente
            </Text>
            <View style={styles.bottomReceiptCutLine}></View>
          </View>
        </View>
        <View style={styles.section}>
          <Receipt data={data} />
          <View style={styles.bottomReceipt}>
            <Text style={styles.bottomReceiptText}>
              Talón para el Tribunal de Cuentas
            </Text>
            <View style={styles.bottomReceiptCutLine}></View>
          </View>
        </View>
        <View style={styles.section}>
          <Receipt data={data} />
          <View style={styles.bottomReceipt}>
            <Text style={styles.bottomReceiptText}>
              Talón para la Municipalidad
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const Receipt = ({ data }: ReceiptPDFProps) => {
  const {
    receiptId,
    taxpayer,
    taxId,
    commercialActivity,
    companyName,
    address,
    addressNumber,
    neighborhood,
    yearToPay,
    observations,
    amount,
  } = data;

  const fullDate = dayjs().locale('es').format('DD-MMMM-YYYY');

  const day = fullDate.split('-')[0];
  const month = fullDate.split('-')[1].toLowerCase();
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
  const year = fullDate.split('-')[2];

  return (
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
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            ACTIVIDAD COMERCIAL
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
              {receiptId}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bodyReceipt}>
        <Text style={styles.bodyTitle}>PAGO DE ACTIVIDAD COMERCIAL</Text>
        <View style={styles.bodyLine}>
          <View
            style={{
              flex: '1 1 100%',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Contribuyente:
            </Text>
            <Text
              style={{
                flex: '1 1 75%',
                borderBottom: '1px dashed black',
                maxLines: 1,
              }}
            >
              {formatName(taxpayer)}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 80%',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Rubro:
            </Text>
            <Text
              style={{
                flex: '1 1 85%',
                borderBottom: '1px dashed black',
                maxLines: 1,
              }}
            >
              {formatName(commercialActivity)}
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
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              CUIT / CUIL:
            </Text>
            <Text
              style={{
                flex: '1 1 60%',
                borderBottom: '1px dashed black',
              }}
            >
              {formatCuilInput(taxId)}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Razón social:
            </Text>
            <Text
              style={{
                flex: '1 1 50%',
                borderBottom: '1px dashed black',
                maxLines: 1,
              }}
            >
              {formatName(companyName)}
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
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Dirección:
            </Text>
            <Text
              style={{
                flex: '1 1 80%',
                borderBottom: '1px dashed black',
                maxLines: 1,
              }}
            >
              {address}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 35%',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Altura:
            </Text>
            <Text
              style={{
                flex: '1 1 70%',
                borderBottom: '1px dashed black',
              }}
            >
              {addressNumber}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 70%',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Barrio:
            </Text>
            <Text
              style={{
                flex: '1 1 90%',
                borderBottom: '1px dashed black',
                maxLines: 1,
              }}
            >
              {formatName(neighborhood)}
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
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Año pagado:
            </Text>
            <Text
              style={{
                flex: '1 1 50%',
                borderBottom: '1px dashed black',
              }}
            >
              {yearToPay}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 100%',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Detalle:
            </Text>
            <Text
              style={{
                flex: '1 1 90%',
                borderBottom: '1px dashed black',
                maxLines: 1,
              }}
            >
              {observations}
            </Text>
          </View>
        </View>
        <View style={{ ...styles.bodyLine, width: '50%' }}>
          <View
            style={{
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
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
              {day}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
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
              {monthCapitalized}
            </Text>
          </View>
          <View
            style={{
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              fontSize: '10px',
              fontWeight: 'normal',
            }}
          >
            <Text
              style={{
                flex: '1 1 auto',
                fontSize: '10px',
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
              {year}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footerReceipt}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: '32px',
              width: '100px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '6px',
              padding: '2px 4px',
              backgroundColor: '#E4E4E4',
            }}
          >
            <Text style={{ fontSize: 20 }}>$</Text>
            <View
              style={{
                width: '100px',
                height: '90%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '4px',
                backgroundColor: '#FFFFFF',
                borderRadius: '3px',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'right',
                }}
              >
                {amount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 10 }}>Importe</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10 }}>Sello</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '100px', borderBottom: '1px dashed black' }} />
          <Text style={{ fontSize: 10 }}>Recibí conforme</Text>
        </View>
      </View>
    </View>
  );
};
