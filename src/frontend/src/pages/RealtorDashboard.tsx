import { useState } from 'react';
import { useGetAllProperties, useGetAllServiceRequests } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Building2, ClipboardList, Plus, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import PropertiesTab from '../components/realtor/PropertiesTab';
import ServiceRequestsTab from '../components/realtor/ServiceRequestsTab';
import AddPropertyDialog from '../components/realtor/AddPropertyDialog';
import CreateRequestDialog from '../components/realtor/CreateRequestDialog';
import DFWInsights from '../components/DFWInsights';

export default function RealtorDashboard() {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const { data: properties = [] } = useGetAllProperties();
  const { data: requests = [] } = useGetAllServiceRequests();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Realtor Dashboard</h1>
        <p className="text-muted-foreground">Manage your properties and service requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
              <p className="text-3xl font-bold text-navy">{properties.length}</p>
            </div>
            <Building2 className="h-10 w-10 text-navy/20" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Requests</p>
              <p className="text-3xl font-bold text-navy">
                {requests.filter((r) => r.status !== 'Completed').length}
              </p>
            </div>
            <ClipboardList className="h-10 w-10 text-navy/20" />
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-gold">
                {requests.filter((r) => r.status === 'Completed').length}
              </p>
            </div>
            <ClipboardList className="h-10 w-10 text-gold/20" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              DFW Insights
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button onClick={() => setShowAddProperty(true)} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
            <Button onClick={() => setShowCreateRequest(true)} className="bg-navy hover:bg-navy/90 gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        <TabsContent value="requests">
          <ServiceRequestsTab />
        </TabsContent>

        <TabsContent value="properties">
          <PropertiesTab />
        </TabsContent>

        <TabsContent value="insights">
          <DFWInsights />
        </TabsContent>
      </Tabs>

      <AddPropertyDialog open={showAddProperty} onOpenChange={setShowAddProperty} />
      <CreateRequestDialog open={showCreateRequest} onOpenChange={setShowCreateRequest} />
    </div>
  );
}
