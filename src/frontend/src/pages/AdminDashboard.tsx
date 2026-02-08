import { useState } from 'react';
import { useGetAllServiceRequests, useGetAllContactForms } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ClipboardList, Mail, AlertCircle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import AdminRequestsTab from '../components/admin/AdminRequestsTab';
import AdminContactFormsTab from '../components/admin/AdminContactFormsTab';
import DFWInsights from '../components/DFWInsights';

export default function AdminDashboard() {
  const { data: requests = [] } = useGetAllServiceRequests();
  const { data: contactForms = [] } = useGetAllContactForms();

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const scheduledCount = requests.filter((r) => r.status === 'Scheduled').length;
  const inProgressCount = requests.filter((r) => r.status === 'In Progress').length;
  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all service requests and inquiries</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending</p>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-navy">{pendingCount}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Scheduled</p>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-navy">{scheduledCount}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <ClipboardList className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-navy">{inProgressCount}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gold">{completedCount}</p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList>
          <TabsTrigger value="requests">
            Service Requests
            {requests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-navy text-white">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="contacts">
            Contact Forms
            {contactForms.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-navy text-white">
                {contactForms.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            DFW Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <AdminRequestsTab />
        </TabsContent>

        <TabsContent value="contacts">
          <AdminContactFormsTab />
        </TabsContent>

        <TabsContent value="insights">
          <DFWInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}
