import {
  confirmRequest,
  getAllRegistrationRequests,
  rejectRequest,
} from '../../actions';
import { DashboardClientPage } from './registrationRequestTable';

export const RegistrationRequestPage = async () => {
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
