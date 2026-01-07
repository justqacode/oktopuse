import { DataTable } from '@/components/data-table';
import { maintenanceRequestsManagerColumn } from './columns';
import { useAuthStore } from '@/auth/authStore';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import formatDate from '@/utils/format-date';

const GET_MANAGER_MAINTENANCE_REQUESTS = gql`
  query GetMaintenanceHistoryStakeHolder {
    getMaintenanceHistoryStakeHolder {
      _id
      description
      status
      createdAt
      category
      images
      propertyDetails {
        name
        propertyType
        address {
          street
          city
          state
          zip
        }
      }
    }
  }
`;

// const GET_MANAGER_MAINTENANCE_REQUESTS = gql`
//   query GetMaintenanceHistoryByManager {
//     getMaintenanceHistoryByManager {
//       _id
//       description
//       status
//       createdAt
//       category
//       images
//       propertyDetails {
//         name
//         propertyType
//         address {
//           street
//           city
//           state
//           zip
//         }
//       }
//     }
//   }
// `;

export default function MaintenanceRequestsManager() {
  const { user } = useAuthStore();
  const { data, loading } = useQuery<any>(GET_MANAGER_MAINTENANCE_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    // variables: { ownerID: '68ccdee49efe164572477f50' },
    variables: { managerID: user?.id },
  });

  // console.log('Landlord Maintenance Requests:', data);

  const maintenanceHistoryData = data?.getMaintenanceHistoryStakeHolder || [];
  // const maintenanceHistoryData = data?.getMaintenanceHistoryByManager || [];
  const maintenanceHistoryFormatted = maintenanceHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    date: formatDate(item.createdAt),
    property: item,
    tenant: item.propertyDetails.name || 0,
    category: item.category || 'Others',
    status: item.status || 'pending',
  }));

  return (
    <DataTable
      columns={maintenanceRequestsManagerColumn}
      data={maintenanceHistoryFormatted}
      // enableDragAndDrop
      // enableSelection
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={10}
      loading={loading}
    />
  );
}
