import { useState } from 'react';
import { useUpdateServiceRequestStatus, useGetAllProperties } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, AlertCircle, Image as ImageIcon, MapPin, Navigation } from 'lucide-react';
import DirectionsDialog from '../DirectionsDialog';
import type { ServiceRequest } from '../../backend';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-800 border-orange-200',
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
};

const statuses = ['Pending', 'Scheduled', 'In Progress', 'Completed'];

interface AdminRequestDetailsDialogProps {
  request: ServiceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminRequestDetailsDialog({ request, open, onOpenChange }: AdminRequestDetailsDialogProps) {
  const [newStatus, setNewStatus] = useState(request.status);
  const [directionsDialogOpen, setDirectionsDialogOpen] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateServiceRequestStatus();
  const { data: properties = [] } = useGetAllProperties();

  const property = properties.find((p) => p.id === request.propertyId);
  const propertyAddress = property 
    ? `${property.address}, ${property.city}, ${property.state} ${property.zip}`
    : 'Unknown Property';

  const handleUpdateStatus = () => {
    if (newStatus !== request.status) {
      updateStatus(
        { requestId: request.id, newStatus },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  };

  const handleOpenDirections = () => {
    if (!property) return;
    setDirectionsDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-navy text-xl">{request.title}</DialogTitle>
              <Badge className={statusColors[request.status as keyof typeof statusColors] || 'bg-gray-100'}>
                {request.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-sm flex-1">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{propertyAddress}</span>
                </div>
                {property && (
                  <Button
                    onClick={handleOpenDirections}
                    variant="outline"
                    size="sm"
                    className="border-navy text-navy hover:bg-navy hover:text-white transition-colors shrink-0"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span>Urgency: <strong>{request.urgency}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last updated {new Date(Number(request.updatedAt) / 1000000).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-navy mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
            </div>

            {request.photos.length > 0 && (
              <div>
                <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Photos ({request.photos.length})
                </h3>
                <div className="text-sm text-muted-foreground">
                  {request.photos.length} photo(s) attached (Photo display requires blob storage integration)
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold text-navy mb-3">Update Status</h3>
              <div className="flex gap-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="flex-1">
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
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isPending || newStatus === request.status}
                  className="bg-navy hover:bg-navy/90"
                >
                  {isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {property && (
        <DirectionsDialog
          open={directionsDialogOpen}
          onOpenChange={setDirectionsDialogOpen}
          destinationAddress={property.address}
          destinationCity={property.city}
          destinationState={property.state}
          destinationZip={property.zip}
        />
      )}
    </>
  );
}
