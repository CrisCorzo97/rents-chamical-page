import { getCitySections, getNeighborhoods } from '../actions';
import { CitySectionTable } from '../components/city-section-table/citySectionTable';
import { NeighborhoodTable } from '../components/neighborhood-table/neighborhoodTable';

export const AdminDashboard = async () => {
  const citySections = await getCitySections();
  const neighborhoods = await getNeighborhoods();

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <div>
        <CitySectionTable data={citySections} />
      </div>
      <div>
        <NeighborhoodTable data={neighborhoods} />
      </div>
    </main>
  );
};
