import { useState } from 'react';
import { useSurpriseRequests, useUpdateSurpriseRequest } from '@/hooks/useSurpriseRequests';
import { useLocalBuddies } from '@/hooks/useLocalBuddies';
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
import type { SurpriseRequest } from '@/integrations/supabase/database.types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Sparkles, Search, Loader2, RefreshCw, User, Calendar,
  DollarSign, MapPin, CheckCircle, Clock, XCircle, UserCheck, Wand2
} from 'lucide-react';

const SurpriseRequestsManagement = () => {
  const { data: requests = [], isLoading, refetch } = useSurpriseRequests();
  const { data: buddies = [] } = useLocalBuddies();
  const { data: trips = [] } = useTrips();
  const updateRequest = useUpdateSurpriseRequest();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<SurpriseRequest | null>(null);
  const [assignedBuddy, setAssignedBuddy] = useState('');
  const [assignedTrip, setAssignedTrip] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const matchedRequests = requests.filter(r => r.status === 'matched');
  const planningRequests = requests.filter(r => r.status === 'planning');
  const completedRequests = requests.filter(r => ['confirmed', 'completed'].includes(r.status));

  const verifiedBuddies = buddies.filter(b => b.is_verified && b.is_active);
  const activeTrips = trips.filter(t => t.status === 'active');

  const filteredRequests = (list: SurpriseRequest[]) =>
    list.filter(req => 
      req.interests_data?.interests?.some(i => 
        i.toLowerCase().includes(searchQuery.toLowerCase())
      ) || req.id.includes(searchQuery)
    );

  const handleMatch = async () => {
    if (!selectedRequest) return;
    
    try {
      await updateRequest.mutateAsync({
        id: selectedRequest.id,
        matched_buddy_id: assignedBuddy || null,
        assigned_trip_id: assignedTrip || null,
        admin_notes: adminNotes,
        status: 'matched',
      });
      toast.success('Request matched successfully!');
      setSelectedRequest(null);
      setAssignedBuddy('');
      setAssignedTrip('');
      setAdminNotes('');
    } catch (error) {
      toast.error('Failed to match request');
    }
  };

  const handleStatusChange = async (request: SurpriseRequest, newStatus: string) => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
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
      case 'matched': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                {request.profiles?.full_name || 'Unknown User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {request.profiles?.email || request.profiles?.phone || `ID: ${request.id.slice(0, 8)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(request.created_at), 'MMM dd, yyyy h:mm a')}
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

        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Interests:</p>
          <div className="flex flex-wrap gap-1">
            {request.interests_data?.interests?.slice(0, 4).map(interest => (
              <Badge key={interest} variant="secondary" className="text-xs capitalize">
                {interest}
              </Badge>
            ))}
            {(request.interests_data?.interests?.length || 0) > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{request.interests_data!.interests.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {request.matched_buddy_id && (
          <div className="flex items-center gap-2 text-sm mb-3 p-2 rounded-lg bg-green-500/10">
            <UserCheck className="w-4 h-4 text-green-500" />
            <span className="text-green-400">Buddy Assigned</span>
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
                  setAssignedBuddy(request.matched_buddy_id || '');
                  setAssignedTrip(request.assigned_trip_id || '');
                  setAdminNotes(request.admin_notes || '');
                }}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                {request.status === 'pending' ? 'Match' : 'Edit'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Match Surprise Request
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Assign Local Buddy</Label>
                  <Select value={assignedBuddy} onValueChange={setAssignedBuddy}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select a buddy" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="">No buddy</SelectItem>
                      {verifiedBuddies.map(buddy => (
                        <SelectItem key={buddy.id} value={buddy.id}>
                          {buddy.city}, {buddy.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign Trip</Label>
                  <Select value={assignedTrip} onValueChange={setAssignedTrip}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select a trip" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="">No trip</SelectItem>
                      {activeTrips.map(trip => (
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
                    placeholder="Add notes about this request..."
                    className="bg-background/50"
                  />
                </div>

                <Button onClick={handleMatch} className="w-full" disabled={updateRequest.isPending}>
                  {updateRequest.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Save Match
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {request.status !== 'completed' && request.status !== 'cancelled' && (
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
          <h1 className="text-3xl font-display font-bold text-foreground">Surprise Requests</h1>
          <p className="text-muted-foreground mt-1">Match users with local buddies and trips</p>
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
              <div className="p-2 rounded-lg bg-blue-500/20">
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{matchedRequests.length}</p>
                <p className="text-xs text-muted-foreground">Matched</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{planningRequests.length}</p>
                <p className="text-xs text-muted-foreground">Planning</p>
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
          placeholder="Search by interests or ID..."
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
          <TabsTrigger value="matched" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Matched ({matchedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="planning" className="gap-2">
            <MapPin className="w-4 h-4" />
            Planning ({planningRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {filteredRequests(pendingRequests).length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests(pendingRequests).map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matched" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests(matchedRequests).map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests(planningRequests).map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests(completedRequests).map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurpriseRequestsManagement;
