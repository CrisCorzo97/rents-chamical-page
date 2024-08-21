const TabContentPage = ({
  params,
}: {
  params: {
    tab_id: string;
  };
}) => {
  return <div>{params.tab_id}</div>;
};
export default TabContentPage;
