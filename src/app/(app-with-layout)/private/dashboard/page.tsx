import {
  confirmRequest,
  getAllRegistrationRequests,
  rejectRequest,
} from './actions';
import { DashboardClientPage } from './page.client';

const DashboardPage = async () => {
  const registrationRequest = await getAllRegistrationRequests();

  return (
    <DashboardClientPage
      registrationRequest={registrationRequest}
      refetch={getAllRegistrationRequests}
      onConfirm={confirmRequest}
      onReject={rejectRequest}
    />
  );
};
export default DashboardPage;
