import * as React from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
} from '@tabler/icons-react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  // Core table functionality
  enableDragAndDrop?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  // Data management
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowDragEnd?: (oldIndex: number, newIndex: number, newData: T[]) => void;

  // Styling
  className?: string;

  // loading state
  loading?: boolean;
}

function DragHandle<T extends Record<string, any>>({
  row,
  enabled = true,
}: {
  row: Row<T>;
  enabled?: boolean;
}) {
  const rowId = row.original.id || row.id;
  const { attributes, listeners } = useSortable({
    id: rowId,
    disabled: !enabled,
  });

  if (!enabled) return null;

  return (
    <Button
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className='text-muted-foreground size-7 hover:bg-transparent'
    >
      <IconGripVertical className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  );
}

function DraggableRow<T extends Record<string, any>>({
  row,
  enableDragAndDrop = true,
}: {
  row: Row<T>;
  enableDragAndDrop?: boolean;
}) {
  const rowId = row.original.id || row.id;
  const sortable = useSortable({
    id: rowId,
    disabled: !enableDragAndDrop,
  });

  if (!enableDragAndDrop) {
    return (
      <TableRow data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={sortable.isDragging}
      ref={sortable.setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function createSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function createDragColumn<T extends Record<string, any>>(): ColumnDef<T> {
  return {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle row={row} />,
    enableSorting: false,
    enableHiding: false,
  };
}

export function createActionsColumn<T>(actions?: {
  onEdit?: (row: T) => void;
  onCopy?: (row: T) => void;
  onDelete?: (row: T) => void;
  onFavorite?: (row: T) => void;
  customActions?: Array<{
    label: string;
    onClick: (row: T) => void;
    variant?: 'default' | 'destructive';
  }>;
}): ColumnDef<T> {
  return {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
            size='icon'
          >
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          {actions?.onEdit && (
            <DropdownMenuItem onClick={() => actions.onEdit?.(row.original)}>Edit</DropdownMenuItem>
          )}
          {actions?.onCopy && (
            <DropdownMenuItem onClick={() => actions.onCopy?.(row.original)}>
              Make a copy
            </DropdownMenuItem>
          )}
          {actions?.onFavorite && (
            <DropdownMenuItem onClick={() => actions.onFavorite?.(row.original)}>
              Favorite
            </DropdownMenuItem>
          )}
          {actions?.customActions?.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(row.original)}
              variant={action.variant}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
          {(actions?.onEdit || actions?.onCopy || actions?.onFavorite) && actions?.onDelete && (
            <DropdownMenuSeparator />
          )}
          {actions?.onDelete && (
            <DropdownMenuItem
              variant='destructive'
              onClick={() => actions.onDelete?.(row.original)}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function DataTable<T extends Record<string, any>>({
  columns: initialColumns,
  data: initialData,
  enableDragAndDrop = false,
  enableSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enableFiltering = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onRowDragEnd,
  className = '',
  loading = false,
}: DataTableProps<T>) {
  // Prepare columns with optional drag and select columns
  const columns = React.useMemo(() => {
    let cols = [...initialColumns];

    if (enableDragAndDrop) {
      cols.unshift(createDragColumn<T>());
    }

    if (enableSelection) {
      const insertIndex = enableDragAndDrop ? 1 : 0;
      cols.splice(insertIndex, 0, createSelectionColumn<T>());
    }

    return cols;
  }, [initialColumns, enableDragAndDrop, enableSelection]);

  // State
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  // Drag and Drop
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => {
    return data?.map((item) => item.id || Math.random().toString()) || [];
  }, [data]);

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Table
  const table = useReactTable({
    data,
    columns,
    state: {
      ...(enableSorting && { sorting }),
      ...(enableColumnVisibility && { columnVisibility }),
      ...(enableSelection && { rowSelection }),
      ...(enableFiltering && { columnFilters }),
      ...(enablePagination && { pagination }),
    },
    getRowId: (row, index) => row.id?.toString() || index.toString(),
    enableRowSelection: enableSelection,
    ...(enableSelection && { onRowSelectionChange: setRowSelection }),
    ...(enableSorting && { onSortingChange: setSorting }),
    ...(enableFiltering && { onColumnFiltersChange: setColumnFilters }),
    ...(enableColumnVisibility && { onColumnVisibilityChange: setColumnVisibility }),
    ...(enablePagination && { onPaginationChange: setPagination }),
    getCoreRowModel: getCoreRowModel(),
    ...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Drag handler
  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return;

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        const newData = arrayMove(prevData, oldIndex, newIndex);

        // Call callback if provided
        onRowDragEnd?.(oldIndex, newIndex, newData);

        return newData;
      });
    }
  }

  return (
    <div className={`relative flex flex-col gap-4 overflow-auto ${className}`}>
      <div className='overflow-hidden rounded-lg border'>
        {enableDragAndDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} enableDragAndDrop={enableDragAndDrop} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      {loading ? (
                        <div className='flex items-center justify-center'>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Loading...
                        </div>
                      ) : (
                        'No results.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        ) : (
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DraggableRow key={row.id} row={row} enableDragAndDrop={false} />
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className='flex items-center justify-end px-4'>
          {enableSelection && (
            <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <Button
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
