import { Button } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCementeryRecords, getProperties } from '../actions';
import { CementeryRecordsTable } from '../components/cementery-records-table/cementeryRecordsTable';
import { PropertiesTable } from '../components/properties-table/propertiesTable';

export const AdminDashboard = async () => {
  const properties = await getProperties({});
  const cementeryRecords = await getCementeryRecords({});

  return (
    <main className='max-w-6xl mx-auto py-4 flex flex-col gap-4'>
      {/* ACÁ IRÍAN LOS BOTONES PARA OTRAS ACCIONES */}
      <div className='space-x-2 p-2'>
        <Button variant='outline' size='default'>
          Editar Secciones de la Ciudad
        </Button>
        <Button variant='outline' size='default'>
          Editar Barrios
        </Button>
      </div>

      {/* ACÁ METER LAS TABLAS PRINCIPALES */}
      <div className='p-2'>
        <Tabs defaultValue='propertyTable'>
          <TabsList>
            <TabsTrigger value='propertyTable'>Inmueble</TabsTrigger>
            <TabsTrigger value='comenteryRecordsTable'>Cementerio</TabsTrigger>
          </TabsList>
          <TabsContent value='propertyTable'>
            <PropertiesTable data={properties} />
          </TabsContent>
          <TabsContent value='comenteryRecordsTable'>
            <CementeryRecordsTable data={cementeryRecords} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};
