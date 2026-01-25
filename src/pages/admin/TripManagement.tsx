import { useState } from 'react';
import { useTrips, useCreateTrip, useUpdateTrip, useDeleteTrip } from '@/hooks/useTrips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, Search, Map } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import type { Trip } from '@/integrations/supabase/database.types';

const TripManagement = () => {
  const { data: trips, isLoading } = useTrips();
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();
  const deleteTrip = useDeleteTrip();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    destination: '',
    country: '',
    description: '',
    image_url: '',
    price: '',
    duration_days: '',
    start_date: '',
    spots_left: '',
    total_spots: '',
  });

  const filteredTrips = trips?.filter(trip =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      destination: '',
      country: '',
      description: '',
      image_url: '',
      price: '',
      duration_days: '',
      start_date: '',
      spots_left: '',
      total_spots: '',
    });
  };

  const handleCreate = async () => {
    try {
      await createTrip.mutateAsync({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        destination: formData.destination,
        country: formData.country,
        description: formData.description || null,
        image_url: formData.image_url || null,
        price: formData.price ? parseFloat(formData.price) : null,
        duration_days: parseInt(formData.duration_days) || 7,
        start_date: formData.start_date || null,
        spots_left: parseInt(formData.spots_left) || 20,
        total_spots: parseInt(formData.total_spots) || 20,
        rating: null,
        trip_type: 'group_fixed',
        category: null,
        min_budget: null,
        max_budget: null,
        is_featured: false,
        min_reservations: null,
        reservation_fee: null,
        status: 'active',
      });
      toast({ title: 'Success', description: 'Trip created successfully!' });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title,
      slug: trip.slug,
      destination: trip.destination,
      country: trip.country,
      description: trip.description || '',
      image_url: trip.image_url || '',
      price: trip.price?.toString() || '',
      duration_days: trip.duration_days.toString(),
      start_date: trip.start_date || '',
      spots_left: trip.spots_left.toString(),
      total_spots: trip.total_spots.toString(),
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTrip) return;
    try {
      await updateTrip.mutateAsync({
        id: editingTrip.id,
        title: formData.title,
        slug: formData.slug,
        destination: formData.destination,
        country: formData.country,
        description: formData.description || null,
        image_url: formData.image_url || null,
        price: formData.price ? parseFloat(formData.price) : null,
        duration_days: parseInt(formData.duration_days) || 7,
        start_date: formData.start_date || null,
        spots_left: parseInt(formData.spots_left) || 20,
        total_spots: parseInt(formData.total_spots) || 20,
      });
      toast({ title: 'Success', description: 'Trip updated successfully!' });
      setIsEditOpen(false);
      setEditingTrip(null);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteTrip.mutateAsync(deleteConfirmId);
      toast({ title: 'Success', description: 'Trip deleted successfully!' });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const TripForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Amazing Bali Adventure"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="amazing-bali-adventure"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination *</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="Bali"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="Indonesia"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the trip..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="45000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration_days">Duration (days)</Label>
          <Input
            id="duration_days"
            type="number"
            value={formData.duration_days}
            onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
            placeholder="7"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spots_left">Spots Left</Label>
          <Input
            id="spots_left"
            type="number"
            value={formData.spots_left}
            onChange={(e) => setFormData({ ...formData, spots_left: e.target.value })}
            placeholder="20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_spots">Total Spots</Label>
          <Input
            id="total_spots"
            type="number"
            value={formData.total_spots}
            onChange={(e) => setFormData({ ...formData, total_spots: e.target.value })}
            placeholder="20"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={!formData.title || !formData.destination || !formData.country}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Trip Management</h1>
          <p className="text-muted-foreground mt-2">Manage all your travel packages</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>
            <TripForm onSubmit={handleCreate} submitLabel="Create Trip" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Trips Table */}
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
                  <TableHead>Trip</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Spots</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips?.map((trip) => (
                  <TableRow key={trip.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {trip.image_url ? (
                          <img src={trip.image_url} alt={trip.title} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Map className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <span className="font-medium">{trip.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{trip.destination}, {trip.country}</TableCell>
                    <TableCell>{trip.duration_days} days</TableCell>
                    <TableCell>₹{trip.price?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>{trip.spots_left}/{trip.total_spots}</TableCell>
                    <TableCell>{trip.start_date || 'TBD'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(trip)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(trip.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTrips?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No trips found
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          <TripForm onSubmit={handleUpdate} submitLabel="Update Trip" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trip and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TripManagement;
