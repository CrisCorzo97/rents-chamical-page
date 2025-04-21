import { getAffidavitsReport } from '../actions';
import { AffidavitsReportClient } from './page.client';

export default async function AffidavitsReportPage() {
  const response = await getAffidavitsReport();

  return <AffidavitsReportClient data={response.data} />;
}
