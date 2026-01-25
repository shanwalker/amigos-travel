import { useState } from 'react';
import { useUsers, useUpdateUserRole } from '@/hooks/useUsers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MoreHorizontal, Shield, ShieldCheck, User, Eye, Palmtree, Mountain, Building2, Wallet, Users as UsersIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { TravelPreferences } from '@/integrations/supabase/database.types';

const BUDGET_LABELS: Record<string, string> = {
  budget_backpacker: 'Budget Backpacker (Under ₹3K/day)',
  smart_saver: 'Smart Saver (₹3K-7K/day)',
  comfort_seeker: 'Comfort Seeker (₹7K-15K/day)',
  luxury_lover: 'Luxury Lover (₹15K+/day)',
};

const TRAVEL_STYLE_LABELS: Record<string, string> = {
  solo: 'Solo Explorer',
  couple: 'Couple/Partner',
  friends: 'Friends Group',
  family: 'Family',
};

const UserManagement = () => {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const filteredUsers = users?.filter((user) => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.roles?.includes(roleFilter);
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, role: string, action: 'add' | 'remove') => {
    try {
      await updateRole.mutateAsync({ userId, role, action });
      toast({ 
        title: 'Success', 
        description: `Role ${action === 'add' ? 'added' : 'removed'} successfully!` 
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      moderator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return styles[role] || styles.user;
  };

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
        <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage users and their roles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <Shield className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="moderator">Moderators</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Preferences</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.full_name || 'No name'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles?.length ? (
                          user.roles.map((role) => (
                            <Badge key={role} variant="outline" className={getRoleBadgeStyle(role)}>
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className={getRoleBadgeStyle('user')}>
                            user
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.travel_preferences?.completed_at ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Preferences
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Manage Roles</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {!user.roles?.includes('admin') ? (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin', 'add')}>
                              <ShieldCheck className="mr-2 h-4 w-4 text-purple-400" />
                              Make Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin', 'remove')}>
                              <Shield className="mr-2 h-4 w-4" />
                              Remove Admin
                            </DropdownMenuItem>
                          )}
                          {!user.roles?.includes('moderator') ? (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'moderator', 'add')}>
                              <Shield className="mr-2 h-4 w-4 text-blue-400" />
                              Make Moderator
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'moderator', 'remove')}>
                              <User className="mr-2 h-4 w-4" />
                              Remove Moderator
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredUsers?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No users found
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold text-foreground">
                {users?.filter(u => u.roles?.includes('admin')).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Moderators</p>
              <p className="text-2xl font-bold text-foreground">
                {users?.filter(u => u.roles?.includes('moderator')).length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 flex items-center gap-4">
            <User className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{users?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Preferences Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {selectedUser?.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedUser?.full_name || 'User'}</span>
                <p className="text-sm font-normal text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser?.travel_preferences?.completed_at ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Wallet className="h-4 w-4" />
                    Budget Style
                  </div>
                  <p className="font-medium text-foreground">
                    {BUDGET_LABELS[selectedUser.travel_preferences.budget_style] || selectedUser.travel_preferences.budget_style}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <UsersIcon className="h-4 w-4" />
                    Travel Style
                  </div>
                  <p className="font-medium text-foreground">
                    {TRAVEL_STYLE_LABELS[selectedUser.travel_preferences.travel_style] || selectedUser.travel_preferences.travel_style}
                  </p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Palmtree className="h-4 w-4" />
                  Interests
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedUser.travel_preferences.interests as string[])?.map((interest: string) => (
                    <Badge key={interest} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {interest.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Accommodation</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedUser.travel_preferences.accommodation_pref?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Activity Level</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedUser.travel_preferences.activity_level}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-right">
                Completed: {format(new Date(selectedUser.travel_preferences.completed_at), 'MMM d, yyyy')}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mountain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>This user hasn't completed the onboarding quiz yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
