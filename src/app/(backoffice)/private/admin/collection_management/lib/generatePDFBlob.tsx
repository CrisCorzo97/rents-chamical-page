import { pdf } from '@react-pdf/renderer';
import { ReceiptPDF, ReceiptPDFProps } from '../components/receiptPDF';

export const generatePdfBlob = async (data: ReceiptPDFProps['data']) => {
  const blob = await pdf(<ReceiptPDF data={data} />).toBlob();
  return blob;
};
