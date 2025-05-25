# Tutorial de uso: Super Componente `CustomTable`

Este tutorial te guiará para utilizar el super componente `CustomTable` en tus proyectos React/Next.js, aprovechando todas sus funcionalidades avanzadas.

---

## 1. Importación

```tsx
import { DataTable } from '@/components/ui/custom-table';
```

---

## 2. Props principales

| Prop                      | Tipo                                                       | Descripción                                                           |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- |
| `columns`                 | `ColumnDef<TData, TValue>[]`                               | Definición de columnas para la tabla (usando TanStack Table).         |
| `data`                    | `TData[]`                                                  | Datos a mostrar en la tabla.                                          |
| `tableTitle`              | `string`                                                   | Título opcional de la tabla.                                          |
| `filterableColumns`       | `{ id, title, options?, type? }[]`                         | Columnas que pueden ser filtradas desde la UI.                        |
| `pagination`              | `Pagination`                                               | Objeto de paginación (página actual, total, etc).                     |
| `searchParams`            | `{ page, limit, sort_by, sort_direction, filters }`        | Parámetros actuales de búsqueda, paginación y filtros.                |
| `onPageChange`            | `(page: number) => void`                                   | Callback al cambiar de página.                                        |
| `onLimitChange`           | `(limit: number) => void`                                  | Callback al cambiar el límite de filas por página.                    |
| `onSortingChange`         | `(sortBy: string, sortDirection: 'asc' \| 'desc') => void` | Callback al cambiar el orden.                                         |
| `onFilterChange`          | `(filterId: string, value: string \| null) => void`        | Callback al cambiar un filtro.                                        |
| `expandedRows`            | `Set<string \| number>`                                    | Conjunto de IDs de filas expandidas.                                  |
| `expandedSubTableColumns` | `{ id: string; title: string }[]`                          | Columnas de la subtabla (si se usa expansión tipo subtabla).          |
| `renderExpandedSubRows`   | `(rowData: TData) => React.ReactNode[]`                    | Función que retorna las filas de la subtabla para una fila expandida. |
| `renderExpandedRow`       | `(rowData: TData) => React.ReactNode`                      | Renderizado libre para la fila expandida (alternativa a subtabla).    |
| `getRowId`                | `(rowData: TData) => string \| number`                     | Función para obtener el ID único de cada fila.                        |

---

## 3. Ejemplo básico de uso

```tsx
import { DataTable, DataTableColumnHeader } from '@/components/ui/custom-table';

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
  },
];

const data = [
  { id: 1, name: 'Juan', status: 'Activo' },
  { id: 2, name: 'Ana', status: 'Borrador' },
];

<DataTable columns={columns} data={data} tableTitle='Usuarios' />;
```

---

## 4. Ejemplo avanzado: paginación, filtros y orden

```tsx
import { useDataTableURLParams } from '@/hooks/useDataTableURLParams';

const {
  currentPage,
  currentLimit,
  currentSortBy,
  currentSortDirection,
  activeFilters,
  handlePageChange,
  handleLimitChange,
  handleSortingChange,
  handleFilterChange,
} = useDataTableURLParams({ defaultLimit: 10 });

<DataTable
  columns={columns}
  data={data}
  tableTitle='Usuarios'
  pagination={pagination}
  filterableColumns={filterableColumns}
  searchParams={{
    page: String(currentPage),
    limit: String(currentLimit),
    sort_by: currentSortBy || undefined,
    sort_direction: currentSortDirection || undefined,
    filters: activeFilters,
  }}
  onPageChange={handlePageChange}
  onLimitChange={handleLimitChange}
  onSortingChange={handleSortingChange}
  onFilterChange={handleFilterChange}
/>;
```

---

## 5. Ejemplo: subtabla (filas expandidas)

```tsx
const subTableColumns = [
  { id: 'tier', title: 'Nombre del Tier' },
  { id: 'price', title: 'Precio' },
  { id: 'dueDate', title: 'Fecha de vencimiento' },
  { id: 'status', title: 'Status' },
];

<DataTable
  columns={columns}
  data={data}
  expandedRows={expandedRows}
  expandedSubTableColumns={subTableColumns}
  renderExpandedSubRows={(row) =>
    row.tiers?.map((tier) => [
      tier.name,
      tier.price,
      tier.dueDate,
      tier.status,
    ]) || []
  }
  getRowId={(row) => row.id}
/>;
```

---

## 6. Buenas prácticas y advertencias

- Usa siempre `getRowId` si tus datos no tienen un campo `id` único.
- Sincroniza los filtros, orden y paginación con la URL usando el hook `useDataTableURLParams` para una mejor experiencia de usuario y compartir enlaces.
- Si usas subtablas, asegúrate de que `expandedSubTableColumns` y `renderExpandedSubRows` estén correctamente definidos.
- Para filtros de texto, aprovecha el debounce automático para evitar múltiples llamadas al backend.
- Personaliza los headers de columna usando el componente `DataTableColumnHeader` para tener orden y menú contextual.
- Puedes ocultar/mostrar columnas usando el menú de opciones de vista.
- El componente es altamente flexible: puedes usar solo las props que necesites y omitir las demás.

---

## 7. Props opcionales y extensibilidad

- Puedes agregar botones de acción personalizados usando la columna de acciones y el componente `ActionButtons`.
- Puedes usar `renderExpandedRow` para un renderizado libre en la expansión de filas si no quieres una subtabla.
- El componente soporta integración con cualquier backend, siempre que adaptes los datos y la paginación.

---

¿Dudas o sugerencias? ¡Revisa el código fuente y los ejemplos incluidos para más inspiración!
