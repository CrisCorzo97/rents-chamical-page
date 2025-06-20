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
import { generateQRCode } from '@/lib/code-generator';
import { LicenseData } from '../../oblea.actions';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  border: {
    border: 1,
    borderColor: '#000000',
    padding: 15,
    height: '50%',
    marginBottom: '50%',
    position: 'relative',
  },
  waterMark: {
    position: 'absolute',
    width: '100%',
    top: '35%',
    left: 0,
    opacity: 0.1,
    fontSize: 100,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerLeft: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    width: '30%',
    alignItems: 'flex-end',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textLogo: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 0,
  },
  title: {
    padding: 2,
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 0,
  },
  dateText: {
    fontSize: 8,
    marginBottom: 10,
  },
  mainContent: {
    marginTop: 10,
    flexDirection: 'row',
  },
  leftContent: {
    width: '70%',
  },
  rightContent: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  infoRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  registrationNumber: {
    marginTop: 16,
    marginBottom: 20,
  },
  registrationLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  registrationValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 10,
  },
  dateValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  activitySectionBorder: {
    minHeight: 110,
    border: 1,
    borderColor: '#000',
    padding: 4,
  },
  activitySection: {
    marginBottom: 6,
    borderRadius: 4,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  activityText: {
    fontSize: 10,
    lineHeight: 1.2,
    maxLines: 2,
    textOverflow: 'ellipsis',
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    left: 15,
    right: 15,
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
  },
  qrCode: {
    width: 140,
    height: 140,
    marginTop: 'auto',
    marginLeft: 'auto',
  },
  blankSpace: {
    height: 10,
  },
});

interface CommercialLicenseProps {
  licenseData: LicenseData;
}

const CommercialLicense: React.FC<CommercialLicenseProps> = ({
  licenseData,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState('');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const verificationUrl = `https://rentas.municipalidadchamical.gob.ar/tramites/oblea/verificar?cuit=${licenseData.cuit}`;
        const qrUrl = await generateQRCode(verificationUrl);
        setQrCodeUrl(qrUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [licenseData]);

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.waterMark}>2025</Text>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                style={styles.logo}
                src='https://apkomtlxqddpzutagjvn.supabase.co/storage/v1/object/public/visual-resourses/Escudo%20de%20Chamical.jpg'
              />
              <Text style={styles.textLogo}>
                Dirección de Rentas{'\n'}Municipalidad de Chamical
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.dateText}>
                Fecha de emisión: {licenseData.issueDate}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>
            Constancia de Habilitación Comercial Municipal
          </Text>

          <View style={styles.mainContent}>
            <View style={styles.leftContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>CUIT/CUIL:</Text>
                <Text style={styles.value}>{licenseData.cuit}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Razón Social:</Text>
                <Text style={styles.value}>{licenseData.businessName}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Contribuyente:</Text>
                <Text style={styles.value}>{licenseData.taxpayerName}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Dirección:</Text>
                <Text style={styles.value}>{licenseData.address}</Text>
              </View>

              {/* <View style={styles.registrationNumber}>
                <Text style={styles.registrationLabel}>N° Habilitación</Text>
                <Text style={styles.registrationValue}>
                  {licenseData.registrationNumber}
                </Text>
              </View> */}

              <View style={styles.blankSpace}></View>

              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Vigencia: </Text>
                <Text style={styles.dateValue}>{licenseData.validUntil}</Text>
              </View>

              <View style={styles.activitySectionBorder}>
                <View style={styles.activitySection}>
                  <Text style={styles.activityTitle}>Actividad Principal:</Text>
                  <Text style={styles.activityText}>
                    {licenseData.mainActivity}
                  </Text>
                </View>
                {Array.isArray(licenseData.otherActivities) &&
                  licenseData.otherActivities.length > 0 && (
                    <View
                      style={{ ...styles.activitySection, marginBottom: 0 }}
                    >
                      <Text style={styles.activityTitle}>
                        Otras Actividades:
                      </Text>
                      {licenseData.otherActivities.map((act, i) => (
                        <Text key={i} style={styles.activityText}>
                          • {act}
                        </Text>
                      ))}
                    </View>
                  )}
              </View>
            </View>

            <View style={styles.rightContent}>
              {qrCodeUrl && <Image style={styles.qrCode} src={qrCodeUrl} />}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Los datos deben ser validados en la página de Rentas Municipal.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CommercialLicense;
