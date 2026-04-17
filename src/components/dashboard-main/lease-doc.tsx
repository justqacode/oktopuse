import { DataTable } from '@/components/data-table';
import { leaseDocColumn } from './columns';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import formatDate from '@/utils/format-date';

const GET_LEASE_DOCS = gql`
  query GetDocuments($filter: String) {
    getDocuments(filter: $filter) {
      id
      name
      originalName
      mimeType
      size
      url
      description
      version
      createdAt
      uploader {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// const sampleData = [
//   {
//     id: 1,
//     docName: 'Lease Agreement.pdf',
//     type: 'PDF',
//     date: '20-09-2024',
//   },
//   {
//     id: 2,
//     docName: 'Payment REceipt Aug 2025.pdf',
//     type: 'PDF',
//     date: '20-09-2024',
//   },
//   {
//     id: 3,
//     docName: 'Move-in checklist.pdf',
//     type: 'PDF',
//     date: '20-09-2024',
//   },
//   {
//     id: 4,
//     docName: 'Notice of Entry.pdf',
//     type: 'PDF',
//     date: '20-09-2024',
//   },
// ];

const sampleData: any = [];

export default function LeaseDoc() {
  const { data, loading } = useQuery<any>(GET_LEASE_DOCS, {
    fetchPolicy: 'cache-and-network',
    variables: { filter: 'lease' },
  });

  const documents = data?.getDocuments || [];
  const formattedDocs = documents.map((doc: any) => ({
    id: doc.id,
    docName: doc.originalName,
    type: doc.name,
    date: formatDate(doc.createdAt) || '',
  }));

  const onDownload = (docId: string) => {
    const doc = documents.find((d: any) => d.id === docId);
    if (doc) {
      window.open(doc.url, '_blank');
    } else {
      console.error('Document not found for download:', docId);
    }
  };

  return (
    <DataTable
      columns={leaseDocColumn(onDownload)}
      data={formattedDocs}
      enablePagination
      enableColumnVisibility
      enableSorting
      enableFiltering
      pageSize={10}
      loading={loading}
    />
  );
}
