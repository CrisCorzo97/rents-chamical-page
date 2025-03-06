export default async function CreateAffidavitPage({
  searchParams,
}: {
  searchParams: Promise<{
    period: string;
    dueDate: string;
  }>;
}) {
  const { period, dueDate } = await searchParams;

  return <div>{`${period} / ${dueDate}`}</div>;
}
