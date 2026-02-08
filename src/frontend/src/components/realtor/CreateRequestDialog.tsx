import { useState } from 'react';
import { useGetAllProperties, useCreateServiceRequest, useUploadPhoto } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, X } from 'lucide-react';

const urgencyLevels = ['Inspection Showstopper', 'High', 'Medium', 'Low'];

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRequestDialog({ open, onOpenChange }: CreateRequestDialogProps) {
  const { data: properties = [] } = useGetAllProperties();
  const [formData, setFormData] = useState({
    propertyId: '',
    title: '',
    description: '',
    urgency: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  const { mutate: createRequest, isPending: isCreating } = useCreateServiceRequest();
  const { mutate: uploadPhoto, isPending: isUploading } = useUploadPhoto();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createRequest(formData, {
      onSuccess: async (requestId) => {
        // Upload photos if any
        if (photos.length > 0) {
          for (const photo of photos) {
            uploadPhoto({ 
              requestId, 
              file: photo,
              onProgress: (percentage) => {
                setUploadProgress((prev) => ({ ...prev, [photo.name]: percentage }));
              }
            });
          }
        }
        
        setFormData({ propertyId: '', title: '', description: '', urgency: '' });
        setPhotos([]);
        setUploadProgress({});
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-navy">Create Service Request</DialogTitle>
          <DialogDescription>Submit a new priority ticket for property maintenance</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="property">Property</Label>
            <Select value={formData.propertyId} onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}, {property.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Request Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Kitchen Cabinet Repair"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue or service needed..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Photos (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload photos</p>
              </label>
            </div>
            
            {photos.length > 0 && (
              <div className="space-y-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm truncate flex-1">{photo.name}</span>
                    {uploadProgress[photo.name] !== undefined && (
                      <span className="text-xs text-muted-foreground mr-2">
                        {uploadProgress[photo.name]}%
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUploading || !formData.propertyId || !formData.urgency}
              className="flex-1 bg-navy hover:bg-navy/90"
            >
              {isCreating ? 'Creating...' : isUploading ? 'Uploading...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
