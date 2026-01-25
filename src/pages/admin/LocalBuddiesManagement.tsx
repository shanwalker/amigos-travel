import { useState } from 'react';
import { useLocalBuddies, useUpdateLocalBuddy } from '@/hooks/useLocalBuddies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocalBuddyCard } from '@/components/buddies/LocalBuddyCard';
import type { LocalBuddy } from '@/integrations/supabase/database.types';
import { toast } from 'sonner';
import { 
  Users, Search, Shield, UserCheck, UserX, 
  MapPin, Loader2, RefreshCw
} from 'lucide-react';

const LocalBuddiesManagement = () => {
  const { data: buddies = [], isLoading, refetch } = useLocalBuddies();
  const updateBuddy = useUpdateLocalBuddy();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const pendingBuddies = buddies.filter(b => !b.is_verified);
  const verifiedBuddies = buddies.filter(b => b.is_verified && b.is_active);
  const inactiveBuddies = buddies.filter(b => !b.is_active);

  const filteredBuddies = (list: LocalBuddy[]) => 
    list.filter(buddy => 
      buddy.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buddy.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleVerify = async (buddy: LocalBuddy) => {
    try {
      await updateBuddy.mutateAsync({
        id: buddy.id,
        is_verified: true,
      });
      toast.success(`${buddy.city} buddy has been verified!`);
    } catch (error) {
      toast.error('Failed to verify buddy');
    }
  };

  const handleToggleActive = async (buddy: LocalBuddy) => {
    try {
      await updateBuddy.mutateAsync({
        id: buddy.id,
        is_active: !buddy.is_active,
      });
      toast.success(`Buddy ${buddy.is_active ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error('Failed to update buddy status');
    }
  };

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
          <h1 className="text-3xl font-display font-bold text-foreground">Local Buddies</h1>
          <p className="text-muted-foreground mt-1">Manage and verify local guide applications</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Shield className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingBuddies.length}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{verifiedBuddies.length}</p>
                <p className="text-xs text-muted-foreground">Verified & Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <UserX className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inactiveBuddies.length}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(buddies.map(b => b.country)).size}
                </p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by city, country, or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="pending" className="gap-2">
            <Shield className="w-4 h-4" />
            Pending ({pendingBuddies.length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Verified ({verifiedBuddies.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="gap-2">
            <UserX className="w-4 h-4" />
            Inactive ({inactiveBuddies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {filteredBuddies(pendingBuddies).length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-12 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending applications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuddies(pendingBuddies).map(buddy => (
                <LocalBuddyCard
                  key={buddy.id}
                  buddy={buddy}
                  showAdminControls
                  onVerify={handleVerify}
                  onDeactivate={handleToggleActive}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          {filteredBuddies(verifiedBuddies).length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-12 text-center">
                <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No verified buddies yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuddies(verifiedBuddies).map(buddy => (
                <LocalBuddyCard
                  key={buddy.id}
                  buddy={buddy}
                  showAdminControls
                  onVerify={handleVerify}
                  onDeactivate={handleToggleActive}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {filteredBuddies(inactiveBuddies).length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-12 text-center">
                <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No inactive buddies</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuddies(inactiveBuddies).map(buddy => (
                <LocalBuddyCard
                  key={buddy.id}
                  buddy={buddy}
                  showAdminControls
                  onVerify={handleVerify}
                  onDeactivate={handleToggleActive}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocalBuddiesManagement;
