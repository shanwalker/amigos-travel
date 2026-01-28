import { useState } from 'react';
import { useCustomRequests, useUpdateCustomRequest } from '@/hooks/useCustomRequests';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { CustomRequestWithUser } from '@/lib/supabase/custom-requests';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Wand2, Search, Loader2, RefreshCw, Users, Calendar,
  DollarSign, MapPin, CheckCircle, Clock, XCircle, FileText, Plane
} from 'lucide-react';

const CustomRequestsManagement = () => {
  const { data: requests = [], isLoading, refetch } = useCustomRequests();
  const { data: trips = [] } = useTrips();
  const updateRequest = useUpdateCustomRequest();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<CustomRequestWithUser | null>(null);
  const [assignedTrip, setAssignedTrip] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const pendingRequests = requests.filter((r: any) => r.status === 'pending');
  const planningRequests = requests.filter((r: any) => r.status === 'reviewing');
  const confirmedRequests = requests.filter((r: any) => r.status === 'approved');
  const completedRequests = requests.filter((r: any) => ['completed', 'rejected'].includes(r.status));

  const handleAssign = async () => {
    if (!selectedRequest) return;
    
    try {
      await updateRequest.mutateAsync({
        id: selectedRequest.id,
        status: 'reviewing',
        adminResponse: adminNotes,
      });
      toast.success('Request assigned successfully!');
      setSelectedRequest(null);
      setAssignedTrip('');
      setAdminNotes('');
    } catch (error) {
      toast.error('Failed to assign request');
    }
  };

  const handleStatusChange = async (request: any, newStatus: string) => {
    try {
      await updateRequest.mutateAsync({
        id: request.id!,
        status: newStatus as any,
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const RequestCard = ({ request }: { request: any }) => (
    <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                Custom #{request.id.slice(0, 8)}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(request.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Budget:</span>
            <span className="text-foreground">₹{request.budget_min?.toLocaleString()} - ₹{request.budget_max?.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Travelers:</span>
            <span className="text-foreground">{request.num_travelers}</span>
          </div>

          {request.preferred_dates && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dates:</span>
              <span className="text-foreground">{request.preferred_dates}</span>
              {request.flexible_dates && (
                <Badge variant="outline" className="text-[10px]">Flexible</Badge>
              )}
            </div>
          )}
        </div>

        {/* Requirements Summary */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Destinations:</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {request.requirements?.destination_ideas?.slice(0, 3).map((dest: string) => (
              <Badge key={dest} variant="outline" className="text-xs capitalize">
                <MapPin className="w-3 h-3 mr-1" />
                {dest}
              </Badge>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">Activities:</p>
          <div className="flex flex-wrap gap-1">
            {request.requirements?.activities?.slice(0, 4).map((activity: string) => (
              <Badge key={activity} variant="secondary" className="text-xs capitalize">
                {activity}
              </Badge>
            ))}
            {(request.requirements?.activities?.length || 0) > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{request.requirements!.activities.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {request.requirements?.special_requirements && (
          <div className="mb-4 p-2 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Special Requirements:</p>
            <p className="text-sm text-foreground line-clamp-2">
              {request.requirements.special_requirements}
            </p>
          </div>
        )}

        {request.assigned_trip_id && (
          <div className="flex items-center gap-2 text-sm mb-3 p-2 rounded-lg bg-green-500/10">
            <Plane className="w-4 h-4 text-green-500" />
            <span className="text-green-400">Trip Assigned</span>
          </div>
        )}

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setSelectedRequest(request);
                  setAssignedTrip(request.assigned_trip_id || '');
                  setAdminNotes(request.admin_notes || '');
                }}
              >
                <FileText className="w-4 h-4 mr-1" />
                {request.status === 'pending' ? 'Assign' : 'Edit'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Manage Custom Request
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Create/Assign Trip</Label>
                  <Select value={assignedTrip} onValueChange={setAssignedTrip}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select or create trip" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="">Create new custom trip</SelectItem>
                      {trips.filter(t => t.trip_type === 'custom').map(trip => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.title} - {trip.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Planning notes, special accommodations, etc..."
                    className="bg-background/50"
                    rows={4}
                  />
                </div>

                <Button onClick={handleAssign} className="w-full" disabled={updateRequest.isPending}>
                  {updateRequest.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Save & Start Planning
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {request.status !== 'completed' && request.status !== 'rejected' && (
            <Select onValueChange={(v) => handleStatusChange(request, v)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Custom Trip Requests</h1>
          <p className="text-muted-foreground mt-1">Plan and manage personalized trip requests</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Wand2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{planningRequests.length}</p>
                <p className="text-xs text-muted-foreground">In Planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{confirmedRequests.length}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Plane className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedRequests.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID or destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="planning" className="gap-2">
            <Wand2 className="w-4 h-4" />
            Planning ({planningRequests.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Confirmed ({confirmedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <Plane className="w-4 h-4" />
            Completed ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-12 text-center">
                <Wand2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending custom requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planningRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomRequestsManagement;
