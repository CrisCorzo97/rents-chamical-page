import {
  confirmRequest,
  getAllRegistrationRequests,
  getUserRole,
  rejectRequest,
} from './actions';
import { DashboardClientPage } from './page.client';
import { AdminDashboard } from './pages';

export default async function DashboardPage() {
  const dashboardDictionary: Record<string, React.FC> = {
    1: AdminDashboard,
  };

  const userRole = await getUserRole();

  const Page = dashboardDictionary[userRole];

  return (
    <Page />

    // <DashboardClientPage
    //   userRole={userRole}
    // registrationRequest={registrationRequest}
    // refetch={getAllRegistrationRequests}
    // onConfirm={confirmRequest}
    // onReject={rejectRequest}
    // />
  );
}
