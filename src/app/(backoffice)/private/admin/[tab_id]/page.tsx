export default async function TabContentPage({
  params,
}: {
  params: {
    tab_id: string;
  };
}) {
  return (
    <div>
      {params.tab_id}
      {/* <PropertyTab data={properties} /> */}
    </div>
  );
}
