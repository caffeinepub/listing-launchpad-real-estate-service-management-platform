import { useState } from 'react';
import { useGetAllServiceRequests, useGetAllProperties } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, Calendar, FileText } from 'lucide-react';
import RequestDetailsDialog from './RequestDetailsDialog';
import type { ServiceRequest } from '../../backend';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-800 border-orange-200',
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
};

const urgencyColors = {
  Low: 'text-green-600',
  Medium: 'text-orange-600',
  High: 'text-red-600',
  'Inspection Showstopper': 'text-red-700 font-bold',
};

export default function ServiceRequestsTab() {
  const { data: requests = [], isLoading: requestsLoading } = useGetAllServiceRequests();
  const { data: properties = [], isLoading: propertiesLoading } = useGetAllProperties();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const isLoading = requestsLoading || propertiesLoading;

  const getPropertyAddress = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? `${property.address}, ${property.city}, ${property.state}` : 'Unknown Property';
  };

  const getProperty = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading service requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No service requests yet. Create your first request to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedRequest(request)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-lg text-navy">{request.title}</CardTitle>
                <Badge className={statusColors[request.status as keyof typeof statusColors] || 'bg-gray-100'}>
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span className={urgencyColors[request.urgency as keyof typeof urgencyColors]}>
                    {request.urgency}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{getPropertyAddress(request.propertyId)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          propertyAddress={getPropertyAddress(selectedRequest.propertyId)}
          property={getProperty(selectedRequest.propertyId)}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      )}
    </>
  );
}
