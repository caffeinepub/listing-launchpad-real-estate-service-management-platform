import { useState } from 'react';
import { useGetAllProperties } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Home, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import DirectionsDialog from '../DirectionsDialog';

export default function PropertiesTab() {
  const { data: properties = [], isLoading } = useGetAllProperties();
  const [directionsDialogOpen, setDirectionsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null>(null);

  const handleOpenDirections = (address: string, city: string, state: string, zip: string) => {
    setSelectedProperty({ address, city, state, zip });
    setDirectionsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading properties...</div>;
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No properties added yet. Click "Add Property" to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg text-navy flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span>{property.address}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{property.city}, {property.state} {property.zip}</p>
                  <p className="text-xs">Added {new Date(Number(property.timestamp) / 1000000).toLocaleDateString()}</p>
                </div>
                <Button
                  onClick={() => handleOpenDirections(property.address, property.city, property.state, property.zip)}
                  variant="outline"
                  size="sm"
                  className="w-full border-navy text-navy hover:bg-navy hover:text-white transition-colors"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProperty && (
        <DirectionsDialog
          open={directionsDialogOpen}
          onOpenChange={setDirectionsDialogOpen}
          destinationAddress={selectedProperty.address}
          destinationCity={selectedProperty.city}
          destinationState={selectedProperty.state}
          destinationZip={selectedProperty.zip}
        />
      )}
    </>
  );
}
