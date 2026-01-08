import { DataTable } from '@/components/data-table';
import { propertiesColumn } from './columns';
import type { Properties } from './types';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { formatCurrency } from '@/utils/format-currency';
import formatDate from '@/utils/format-date';
import { useState } from 'react';
import { Button } from '../ui/button';
import PropertyPreviewModal from './modals/property-preview-modal';

const GET_PROPERTIES = gql`
  query GetMyProperties {
    getMyProperties {
      id
      name
      amount
      description
      images
      propertyType
      createdAt
      address {
        street
        city
        state
        zip
      }
    }
  }
`;

export default function Properties() {
  const { data, loading } = useQuery<any>(GET_PROPERTIES, {
    fetchPolicy: 'cache-and-network',
  });

  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const propertyData = data?.getMyProperties || [];
  const propertyDataFormatted = propertyData.map((item: any) => ({
    id: '...' + item.id.slice(-6),
    name: item.name,
    date: formatDate(item.createdAt),
    description: item.description.split(0, 22) || 0,
    images: item.images || 0,
    propertyType: item.propertyType || 'N/A',
    amount: formatCurrency(item.amount) || 'N/A',
    address: `${item.address.street}, ${item.address.city}, ${item.address.state} ${item.address.zip}`,
    propertyAll: item,
  }));

  const handleRowClick = (property: any) => {
    setSelectedProperty(property?.propertyAll);
    setPreviewOpen(true);
  };

  return (
    <>
      <DataTable
        columns={propertiesColumn}
        data={propertyDataFormatted}
        enablePagination
        enableSorting
        enableFiltering
        pageSize={10}
        loading={loading}
        onRowClick={handleRowClick}
      />

      <PropertyPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        requests={selectedProperty}
      />
    </>
  );
}
