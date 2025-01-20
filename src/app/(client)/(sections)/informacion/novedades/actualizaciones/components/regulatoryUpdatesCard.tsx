import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface RegulatoryUpdatesCardProps {
  title: string;
  date: string;
  description: string;
  downloadLink: string;
}

function RegulatoryUpdatesCard({
  title,
  date,
  description,
  downloadLink,
}: RegulatoryUpdatesCardProps) {
  return (
    <Card className='bg-white shadow-md mb-6'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold mb-2'>{title}</CardTitle>
        <CardDescription className='text-sm text-gray-500 mb-4'>
          {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='mb-4 font-light'>{description}</p>
        <Link
          href={downloadLink}
          download
          className='text-blue-500 hover:underline'
          target='_blank'
        >
          Descargar documento
        </Link>
      </CardContent>
    </Card>
  );
}
export default RegulatoryUpdatesCard;
