import { DataTable } from '@/components/data-table';
import { maintenanceRequestsManagerColumn } from './columns';
import { useAuthStore } from '@/auth/authStore';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import formatDate from '@/utils/format-date';
import { CheckCircle, Clock, PlayCircle, XCircle } from 'lucide-react';

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

const UPDATE_MAINTENANCE_STATUS = gql`
  mutation UpdateStatus($requestID: ID!, $status: String!) {
    updateMaintenanceStatus(requestID: $requestID, status: $status) {
      _id
      description
      status
    }
  }
`;

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className='w-4 h-4' />;
    case 'in-progress':
      return <PlayCircle className='w-4 h-4' />;
    case 'resolved':
      return <CheckCircle className='w-4 h-4' />;
    case 'rejected':
      return <XCircle className='w-4 h-4' />;
    default:
      return null;
  }
};

export default function MaintenanceRequestsManager() {
  const { user } = useAuthStore();
  const { data, loading, refetch } = useQuery<any>(GET_MANAGER_MAINTENANCE_REQUESTS, {
    fetchPolicy: 'cache-and-network',
    variables: { managerID: user?.id },
  });

  const maintenanceHistoryData = data?.getMaintenanceHistoryStakeHolder || [];
  const maintenanceHistoryFormatted = maintenanceHistoryData.map((item: any) => ({
    id: '...' + item._id.slice(-6),
    maintenanceId: item._id,
    date: formatDate(item.createdAt),
    property: item,
    tenant: item.propertyDetails.name || 0,
    category: item.category || 'Others',
    status: item.status || 'pending',
  }));

  const [updateMaintenanceStatus, { loading: updating }] = useMutation(UPDATE_MAINTENANCE_STATUS, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error updating maintenance status:', error);
    },
  });

  const handleStatusUpdate = async (maintenanceId: string, newStatus: string) => {
    try {
      await updateMaintenanceStatus({
        variables: {
          requestID: maintenanceId,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <DataTable
      // columns={maintenanceRequestsManagerColumn}
      columns={maintenanceRequestsManagerColumn(handleStatusUpdate)}
      data={maintenanceHistoryFormatted}
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={10}
      loading={loading || updating}
    />
  );
}
