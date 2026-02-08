import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Realtor');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile({ name: name.trim(), role });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-navy">Welcome to Listing Launchpad</DialogTitle>
          <DialogDescription>
            Please complete your profile to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>I am a:</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Realtor" id="realtor" />
                <Label htmlFor="realtor" className="font-normal cursor-pointer">
                  Realtor (Client)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Admin" id="admin" />
                <Label htmlFor="admin" className="font-normal cursor-pointer">
                  Admin (Service Team)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" disabled={isPending || !name.trim()} className="w-full bg-navy hover:bg-navy/90">
            {isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
