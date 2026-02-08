import { useState } from 'react';
import { useGetAllServiceRequests, useUpdateServiceRequestStatus } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { ClipboardList, MapPin, Calendar, AlertCircle, Search } from 'lucide-react';
import AdminRequestDetailsDialog from './AdminRequestDetailsDialog';
import type { ServiceRequest } from '../../backend';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-800 border-orange-200',
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
};

const urgencyColors = {
  'Inspection Showstopper': 'text-red-600',
  High: 'text-orange-600',
  Medium: 'text-yellow-600',
  Low: 'text-green-600',
};

const statuses = ['All', 'Pending', 'Scheduled', 'In Progress', 'Completed'];

export default function AdminRequestsTab() {
  const { data: requests = [], isLoading } = useGetAllServiceRequests();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading requests...</div>;
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg text-navy">{request.title}</CardTitle>
                  <Badge className={statusColors[request.status as keyof typeof statusColors] || 'bg-gray-100'}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className={`h-4 w-4 ${urgencyColors[request.urgency as keyof typeof urgencyColors] || 'text-gray-600'}`} />
                    <span className={urgencyColors[request.urgency as keyof typeof urgencyColors] || 'text-gray-600'}>
                      {request.urgency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}</span>
                  </div>
                  {request.photos.length > 0 && (
                    <p className="text-sm text-muted-foreground">{request.photos.length} photo(s) attached</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedRequest && (
        <AdminRequestDetailsDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
        />
      )}
    </>
  );
}
