# Componentes, hooks y utilidades requeridos para `CustomTable`

Esta es la lista de todos los elementos necesarios para que el super componente `CustomTable` funcione correctamente, con una breve explicación de su propósito.

## Componentes de Shadcn/UI requeridos

- **Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableCaption** (`components/ui/custom-table/table.tsx`):
  Estructura base de la tabla, filas, celdas y encabezados.
- **Button** (`components/ui/button.tsx`):
  Botón reutilizable para acciones en la tabla y filtros.
- **DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator** (`components/ui/dropdown-menu.tsx`):
  Menús desplegables para opciones de columnas y filtros.
- **Select, SelectContent, SelectItem, SelectTrigger, SelectValue** (`components/ui/select.tsx`):
  Selectores para filtros y cantidad de filas por página.
- **Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis** (`components/ui/pagination.tsx`):
  Componentes para la paginación avanzada.
- **Popover, PopoverContent, PopoverTrigger** (`components/ui/popover.tsx`):
  Para filtros facetados.
- **Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator** (`components/ui/command.tsx`):
  Para filtros facetados avanzados.
- **Badge** (`components/ui/badge.tsx`):
  Para mostrar etiquetas de filtros activos.
- **Tooltip, TooltipProvider, TooltipTrigger, TooltipContent** (`components/ui/tooltip.tsx`):
  Para mostrar información adicional en botones de acción.

## Componentes internos de la tabla

- **DataTable** (`components/ui/custom-table/data-table.tsx`):
  Componente principal de la tabla, maneja renderizado, expansión, filtros, orden y paginación.
- **DataTableToolbar** (`components/ui/custom-table/data-table-toolbar.tsx`):
  Barra de herramientas para filtros y búsqueda.
- **DataTablePagination** (`components/ui/custom-table/data-table-pagination.tsx`):
  Paginador con selector de filas por página y navegación.
- **DataTableViewOptions** (`components/ui/custom-table/data-table-view-options.tsx`):
  Selector de columnas visibles.
- **DataTableColumnHeader** (`components/ui/custom-table/data-table-column-header.tsx`):
  Encabezado de columna con orden y menú contextual.
- **DataTableFacetedFilter** (`components/ui/custom-table/data-table-faceted-filter.tsx`):
  Filtros facetados avanzados (si se usan).
- **StatusBadge** (`components/ui/custom-table/status-badge.tsx`):
  Badge de estado para mostrar el estado de filas o subfilas.
- **ActionButtons** (`components/ui/custom-table/action-buttons.tsx`):
  Botones de acción (ver, editar, etc.) para cada fila.
- **TableSkeleton** (`components/ui/custom-table/table-skeleton.tsx`):
  Skeleton de carga para la tabla.

## Hooks personalizados

- **useDataTableURLParams** (`hooks/useDataTableURLParams.ts`):
  Sincroniza los filtros, orden y paginación de la tabla con los parámetros de la URL.
- **useDebounce** (`hooks/useDebounce.ts`):
  Hook para debouncing en los filtros de búsqueda.

## Utilidades y tipos

- **processTableData** (`lib/table-utils.ts`):
  Función utilitaria para filtrar, ordenar y paginar datos a partir de mocks. Si tu API ya se encarga de esto, omite el uso de esta función.
- **Tipos** (`lib/types.ts`):
  Tipos base para paginación, filtros y respuestas de la API.

## Dependencias externas

- **@tanstack/react-table**: Motor de tablas y manipulación de datos.
- **Lucide-react**: Íconos para acciones, orden y menús.
- **Tailwind CSS**: Utilidades de estilos.
- **Radix UI**: Base de algunos componentes de Shadcn.

---

Cada uno de estos elementos es fundamental para que el super componente `CustomTable` funcione de forma completa, flexible y reutilizable en cualquier contexto de Next.js/React.
