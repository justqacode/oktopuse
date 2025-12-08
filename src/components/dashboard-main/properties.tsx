import { DataTable } from '@/components/data-table';
import { propertiesColumn } from './columns';
import type { Properties } from './types';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { formatCurrency } from '@/utils/format-currency';
import formatDate from '@/utils/format-date';

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
  }));

  return (
    <DataTable
      columns={propertiesColumn}
      data={propertyDataFormatted}
      enablePagination
      enableSorting
      enableFiltering
      pageSize={5}
      loading={loading}
    />
  );
}
