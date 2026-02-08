import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Calendar, AlertCircle, Image as ImageIcon, Navigation } from 'lucide-react';
import DirectionsDialog from '../DirectionsDialog';
import type { ServiceRequest, Property } from '../../backend';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-800 border-orange-200',
  Scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
};

interface RequestDetailsDialogProps {
  request: ServiceRequest;
  propertyAddress: string;
  property?: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestDetailsDialog({ request, propertyAddress, property, open, onOpenChange }: RequestDetailsDialogProps) {
  const [directionsDialogOpen, setDirectionsDialogOpen] = useState(false);

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
