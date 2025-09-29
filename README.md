# This is the Front end of Oktopuse website

### Tools used

React + Vite + Typescript + Tailwind

# 📊 DataTable & TabsLayout

A flexible set of components for building **interactive tables** and
**tabbed layouts** in React apps, powered by:

- [`@tanstack/react-table`](https://tanstack.com/table) -- table logic
- [`@dnd-kit`](https://dndkit.com/) -- drag and drop
- [`shadcn/ui`](https://ui.shadcn.com/) -- styled UI components
- [`@tabler/icons-react`](https://tabler-icons.io/) -- icons

---

## ✨ Features

### DataTable

- ✅ Sorting, Filtering, Pagination\
- ✅ Column Visibility toggles\
- ✅ Row Selection with checkboxes\
- ✅ Row Drag & Drop reordering\
- ✅ Custom Action menu per row\
- ✅ Extensible with your own columns

### TabsLayout

- ✅ Tab navigation with labels & badges\
- ✅ Pluggable header actions (buttons, filters, etc.)\
- ✅ Works seamlessly with `DataTable`

---

## 📦 Installation

Make sure you have the peer dependencies installed:

```bash
npm install @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @tabler/icons-react
```

---

## 🖥️ Usage

### 1. Define Your Columns

```tsx
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react';

type RowData = {
  id: number;
  date: string;
  type: string;
  status: 'paid' | 'pending' | 'overdue';
};

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <Button variant='link' className='px-0'>
        {row.original.id}
      </Button>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => row.original.date,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => row.original.type,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant='outline'>
        {row.original.status === 'paid' ? (
          <IconCircleCheckFilled className='fill-green-500 size-4' />
        ) : (
          <IconLoader className='size-4' />
        )}
        {row.original.status}
      </Badge>
    ),
  },
];
```

---

### 2. Basic Table

```tsx
import { DataTable } from '@/components/data-table';

const sampleData = [
  { id: 1, date: '20-09-2024', type: 'Executive Summary', status: 'paid' },
  { id: 2, date: '20-09-2024', type: 'Technical Approach', status: 'pending' },
  { id: 3, date: '20-09-2024', type: 'Design', status: 'overdue' },
];

export default function Example() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      enableSorting
      enableFiltering
      enablePagination
      enableColumnVisibility
      enableSelection
      enableDragAndDrop
      pageSize={5}
    />
  );
}
```

---

### 3. Tabs with Tables

```tsx
import { TabsLayout, TabsContent } from '@/components/tab-layout';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

const tabs = [
  { value: 'rent-history', label: 'Rent History' },
  { value: 'maintenance-requests', label: 'Maintenance Requests' },
  { value: 'lease-documents', label: 'Lease Documents', badge: 2 },
];

export default function DashboardHome() {
  return (
    <TabsLayout
      tabs={tabs}
      defaultValue='rent-history'
      header={
        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            <IconPlus /> Add
          </Button>
        </div>
      }
    >
      <TabsContent value='rent-history'>
        <DataTable columns={columns} data={sampleData} enableSorting enablePagination />
      </TabsContent>

      <TabsContent value='maintenance-requests'>
        <DataTable columns={columns} data={sampleData} enableSorting enablePagination />
      </TabsContent>

      <TabsContent value='lease-documents'>
        <DataTable columns={columns} data={sampleData} enableSorting enablePagination />
      </TabsContent>
    </TabsLayout>
  );
}
```

---

## ⚙️ DataTable Props

---

Prop Type Default Description

---

`columns` `ColumnDef<T>[]` --- Column
definitions

`data` `T[]` --- Table data

`enableDragAndDrop` `boolean` `false` Enables row
reordering

`enableSelection` `boolean` `false` Adds checkbox
column

`enablePagination` `boolean` `true` Enables
pagination
footer

`enableColumnVisibility` `boolean` `true` Toggle column
visibility

`enableSorting` `boolean` `true` Enable
sorting

`enableFiltering` `boolean` `true` Enable column
filters

`pageSize` `number` `10` Initial page
size

`pageSizeOptions` `number[]` `[10,20,30,40,50]` Dropdown
options for
rows per page

`onRowDragEnd` `(oldIndex, newIndex, newData) => void` --- Callback when
row is
reordered

---

---

## ⚙️ TabsLayout Props

---

Prop Type Description

---

`tabs` `{ value: string, label: string, badge?: number }[]` Tab items

`defaultValue` `string` Initial
active tab

`header` `React.ReactNode` Optional
header
actions

---

---

## 🚀 Example Use Cases

- **Admin Dashboards**: Paginated, sortable data tables with bulk
  actions.\
- **Tenant Portals**: Rent history, maintenance requests, and
  documents under tabs.\
- **CRM Systems**: Organize leads, accounts, and activities in tabbed
  views.
