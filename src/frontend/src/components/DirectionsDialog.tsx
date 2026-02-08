import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Navigation, MapPin } from 'lucide-react';

interface DirectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
}

export default function DirectionsDialog({
  open,
  onOpenChange,
  destinationAddress,
  destinationCity,
  destinationState,
  destinationZip,
}: DirectionsDialogProps) {
  const [startingPoint, setStartingPoint] = useState('');

  const fullDestination = `${destinationAddress}, ${destinationCity}, ${destinationState} ${destinationZip}`;

  const handleGetDirections = () => {
    if (!startingPoint.trim()) return;

    const encodedStart = encodeURIComponent(startingPoint);
    const encodedDestination = encodeURIComponent(fullDestination);

    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Use Apple Maps on iOS, Google Maps on other devices
    const mapsUrl = isIOS
      ? `maps://maps.apple.com/?saddr=${encodedStart}&daddr=${encodedDestination}`
      : `https://www.google.com/maps/dir/?api=1&origin=${encodedStart}&destination=${encodedDestination}`;

    window.open(mapsUrl, '_blank');
    
    // Close dialog and reset
    setStartingPoint('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setStartingPoint('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy flex items-center gap-2">
            <Navigation className="h-5 w-5 text-gold" />
            Get Directions
          </DialogTitle>
          <DialogDescription>
            Enter your starting location to get directions to the property.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="starting-point">Starting Point</Label>
            <Input
              id="starting-point"
              placeholder="Enter your current address or location"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && startingPoint.trim()) {
                  handleGetDirections();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Destination
            </Label>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {fullDestination}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGetDirections}
            disabled={!startingPoint.trim()}
            className="w-full sm:w-auto bg-navy hover:bg-navy/90 text-white"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Open Directions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
