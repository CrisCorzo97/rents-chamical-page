import { getUserRole } from './actions';
import { OperatorDashboard } from './pages';

export default async function DashboardPage() {
  const dashboardDictionary: Record<string, React.FC> = {
    1: OperatorDashboard,
  };

  const userRole = await getUserRole();

  const Page = dashboardDictionary[userRole];

  return <Page />;
}
