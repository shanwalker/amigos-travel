import { useState } from 'react';
import { useSurpriseRequests } from '@/hooks/useSurpriseRequests';
import { useCustomRequests } from '@/hooks/useCustomRequests';
import { useReservations } from '@/hooks/useReservations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, Sparkles, Wand2, Ticket, Eye, User, Calendar, Wallet, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { UserJourneyCard } from '@/components/admin/UserJourneyCard';

const AllRequestsManagement = () => {
  const { data: surpriseRequests = [], isLoading: loadingSurprise } = useSurpriseRequests();
  const { data: customRequests = [], isLoading: loadingCustom } = useCustomRequests();
  const { data: reservations = [], isLoading: loadingReservations } = useReservations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requestType, setRequestType] = useState<string>('');

  const isLoading = loadingSurprise || loadingCustom || loadingReservations;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      matched: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      planning: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  const filterRequests = (requests: any[]) => {
    return requests.filter((req) => {
      const userName = req.profiles?.full_name || req.profiles?.email || '';
      const matchesSearch = userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const allRequests = [
    ...surpriseRequests.map(r => ({ ...r, type: 'surprise' })),
    ...customRequests.map(r => ({ ...r, type: 'custom' })),
    ...reservations.map(r => ({ ...r, type: 'reservation' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredAll = filterRequests(allRequests);
  const filteredSurprise = filterRequests(surpriseRequests.map(r => ({ ...r, type: 'surprise' })));
  const filteredCustom = filterRequests(customRequests.map(r => ({ ...r, type: 'custom' })));
  const filteredReservations = filterRequests(reservations.map(r => ({ ...r, type: 'reservation' })));

  const handleViewDetails = (request: any, type: string) => {
    setSelectedRequest(request);
    setRequestType(type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'surprise': return <Sparkles className="h-4 w-4 text-purple-400" />;
      case 'custom': return <Wand2 className="h-4 w-4 text-orange-400" />;
      case 'reservation': return <Ticket className="h-4 w-4 text-blue-400" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'surprise': return 'Surprise Trip';
      case 'custom': return 'Custom Trip';
      case 'reservation': return 'Reservation';
      default: return type;
    }
  };

  const renderRequestTable = (requests: any[]) => (
    <Table>
      <TableHeader>
        <TableRow className="border-border/50">
          <TableHead>User</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={`${request.type}-${request.id}`} className="border-border/50">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={request.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {request.profiles?.full_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.profiles?.full_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{request.profiles?.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getTypeIcon(request.type)}
                <span className="text-sm">{getTypeLabel(request.type)}</span>
              </div>
            </TableCell>
            <TableCell>
              {request.budget_min && request.budget_max ? (
                <span className="text-sm">
                  ₹{request.budget_min?.toLocaleString()} - ₹{request.budget_max?.toLocaleString()}
                </span>
              ) : request.trips?.price ? (
                <span className="text-sm">₹{request.trips?.price?.toLocaleString()}</span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusBadge(request.status)}>
                {request.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {format(new Date(request.created_at), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(request, request.type)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {requests.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
              No requests found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">All Requests</h1>
        <p className="text-muted-foreground mt-2">Unified view of all user requests and reservations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Surprise Requests</p>
              <p className="text-2xl font-bold text-foreground">{surpriseRequests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <Wand2 className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custom Requests</p>
              <p className="text-2xl font-bold text-foreground">{customRequests.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Ticket className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reservations</p>
              <p className="text-2xl font-bold text-foreground">{reservations.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Calendar className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">
                {allRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="matched">Matched</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="all">All ({allRequests.length})</TabsTrigger>
            <TabsTrigger value="surprise">Surprise ({surpriseRequests.length})</TabsTrigger>
            <TabsTrigger value="custom">Custom ({customRequests.length})</TabsTrigger>
            <TabsTrigger value="reservations">Reservations ({reservations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-0">
                {renderRequestTable(filteredAll)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surprise">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-0">
                {renderRequestTable(filteredSurprise)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-0">
                {renderRequestTable(filteredCustom)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-0">
                {renderRequestTable(filteredReservations)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {getTypeIcon(requestType)}
              <span>{getTypeLabel(requestType)} Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedRequest.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {selectedRequest.profiles?.full_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{selectedRequest.profiles?.full_name || 'Unknown User'}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.profiles?.email}</p>
                  {selectedRequest.profiles?.phone && (
                    <p className="text-sm text-muted-foreground">{selectedRequest.profiles?.phone}</p>
                  )}
                </div>
                <Badge variant="outline" className={`ml-auto ${getStatusBadge(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </Badge>
              </div>

              {/* User Journey Card */}
              {selectedRequest.profiles?.travel_preferences && (
                <UserJourneyCard 
                  travelPreferences={selectedRequest.profiles.travel_preferences}
                  createdAt={selectedRequest.profiles.created_at}
                />
              )}

              {/* Request Details */}
              <Card className="bg-muted/20 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(selectedRequest.budget_min || selectedRequest.budget_max) && (
                    <div className="flex items-center gap-3">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Budget Range</p>
                        <p className="font-medium">
                          ₹{selectedRequest.budget_min?.toLocaleString()} - ₹{selectedRequest.budget_max?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.preferred_dates && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Dates</p>
                        <p className="font-medium">{selectedRequest.preferred_dates}</p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.num_travelers && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Number of Travelers</p>
                        <p className="font-medium">{selectedRequest.num_travelers}</p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.trips && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Reserved Trip</p>
                        <p className="font-medium">{selectedRequest.trips.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedRequest.trips.destination}, {selectedRequest.trips.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.interests_data && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedRequest.interests_data.interests || []).map((interest: string) => (
                          <Badge key={interest} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {interest.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.requirements && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                      <div className="p-3 rounded-lg bg-background/50 text-sm">
                        {selectedRequest.requirements.special_requirements || 'No special requirements'}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-right">
                Created: {format(new Date(selectedRequest.created_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllRequestsManagement;
