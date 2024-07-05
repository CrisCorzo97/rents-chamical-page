import { Table } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/types/envelope';
import React, { Key, useCallback, useMemo } from 'react';

type Column<T> = {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => JSX.Element;
};

type PruebasUiClientProps<RecordType> = {
  title?: string;
  dataSource: RecordType[];
  rowKey: keyof RecordType;
  columns: Column<RecordType>[];
  pagination?: Pagination;
  error?: string;
};

function PruebasUiClient<RecordType>(props: PruebasUiClientProps<RecordType>) {
  const { title, dataSource, rowKey, columns, pagination, error } = props;

  const Title = useMemo(() => {
    let Component = () => <></>;

    if (title) {
      const TitleComponent = () => (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      );
      TitleComponent.displayName = 'TitleComponent';

      Component = TitleComponent;
    }

    return Component;
  }, [title]);

  const CustomTableHeader = useMemo(() => {
    const TableHeaderComponent = () => (
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.title}>{column.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
    TableHeaderComponent.displayName = 'TableHeaderComponent';

    return TableHeaderComponent;
  }, [columns]);

  const tableCellContent = useCallback(
    (record: RecordType, column: Column<RecordType>) => {
      if (column.render) {
        return column.render(record[column.dataIndex], record);
      }

      if (
        typeof record[column.dataIndex] === 'object' &&
        record[column.dataIndex] !== null
      ) {
        // Assuming you want to render object as JSON string
        return JSON.stringify(record[column.dataIndex]);
      }

      return record[column.dataIndex] as React.ReactNode;
    },
    []
  );

  const CustomTableBody = useMemo(() => {
    const TableBodyComponent = () => (
      <TableBody>
        {dataSource.map((record) => (
          <TableRow key={record[rowKey] as Key}>
            {columns.map((column) => (
              <TableCell key={column.title}>
                {tableCellContent(record, column)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
    TableBodyComponent.displayName = 'TableBodyComponent';

    return TableBodyComponent;
  }, [dataSource, columns, rowKey, tableCellContent]);

  return (
    <Card className='w-full flex flex-col'>
      <Title />
      <CardContent>
        <Table>
          <CustomTableHeader />
          <CustomTableBody />
        </Table>
      </CardContent>
    </Card>
  );
}
export default PruebasUiClient;
