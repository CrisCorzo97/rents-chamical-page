import { BlobProvider } from '@react-pdf/renderer';
import { useEffect, useMemo, useRef } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import ReceiptPDF from './receiptPDF';

export function PDFUploader({
  data,
  invoice,
  onUploaded,
}: {
  data: any;
  invoice: any;
  onUploaded: (file: File, invoice: any) => void;
}) {
  const memoizedDocument = useMemo(
    () => <ReceiptPDF data={data} />,
    [JSON.stringify(data)]
  );

  return (
    <BlobProvider document={memoizedDocument}>
      {(props) => (
        <BlobHandler
          {...props}
          data={data}
          invoice={invoice}
          onUploaded={onUploaded}
        />
      )}
    </BlobProvider>
  );
}

function BlobHandler({
  blob,
  loading,
  error,
  data,
  invoice,
  onUploaded,
}: {
  blob: Blob | null;
  loading: boolean;
  error: Error | null;
  data: any;
  invoice: any;
  onUploaded: (file: File, invoice: any) => void;
}) {
  const hasUploaded = useRef(false);

  useEffect(() => {
    if (blob && invoice && !hasUploaded.current) {
      const file = new File([blob], `${invoice.id}.pdf`, {
        type: 'application/pdf',
      });

      onUploaded(file, invoice);
      hasUploaded.current = true;
    }
  }, [blob, invoice, onUploaded]);

  if (loading || !blob) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <PDFViewer className='flex-1 h-[95%] w-[95%] m-auto'>
      <ReceiptPDF data={data} />
    </PDFViewer>
  );
}
