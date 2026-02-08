import { useGetAllContactForms } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mail, Phone, Calendar, User } from 'lucide-react';

export default function AdminContactFormsTab() {
  const { data: forms = [], isLoading } = useGetAllContactForms();

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading contact forms...</div>;
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No contact form submissions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {forms.map((form) => (
        <Card key={form.id}>
          <CardHeader>
            <CardTitle className="text-lg text-navy flex items-center gap-2">
              <User className="h-5 w-5" />
              {form.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${form.email}`} className="text-navy hover:underline">
                {form.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${form.phone}`} className="text-navy hover:underline">
                {form.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Submitted {new Date(Number(form.submittedAt) / 1000000).toLocaleDateString()}</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-navy mb-1">Message:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{form.message}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
