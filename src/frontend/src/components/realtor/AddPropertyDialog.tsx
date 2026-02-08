import { useState } from 'react';
import { useAddProperty } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const dfwCities = [
  'Allen', 'Dallas', 'Frisco', 'McKinney', 'Plano', 'Richardson', 'Carrollton', 
  'Garland', 'Irving', 'Lewisville', 'Mesquite', 'Prosper', 'The Colony', 'Wylie'
];

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPropertyDialog({ open, onOpenChange }: AddPropertyDialogProps) {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: 'TX',
    zip: '',
  });
  const { mutate: addProperty, isPending } = useAddProperty();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    addProperty(
      { id, ...formData },
      {
        onSuccess: () => {
          setFormData({ address: '', city: '', state: 'TX', zip: '' });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy">Add New Property</DialogTitle>
          <DialogDescription>Add a property to your portfolio</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {dfwCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value="TX" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="75001"
                required
                maxLength={5}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.city} className="flex-1 bg-navy hover:bg-navy/90">
              {isPending ? 'Adding...' : 'Add Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
