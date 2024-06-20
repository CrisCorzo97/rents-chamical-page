import {
  confirmRequest,
  getAllRegistrationRequests,
  rejectRequest,
} from './actions';
import { DashboardClientPage } from './page.client';

export default async function DashboardPage() {
  const registrationRequest = await getAllRegistrationRequests();

  return (
    <DashboardClientPage
      registrationRequest={registrationRequest}
      refetch={getAllRegistrationRequests}
      onConfirm={confirmRequest}
      onReject={rejectRequest}
    />
  );
}
