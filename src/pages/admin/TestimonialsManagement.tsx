import { useState } from 'react';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/useTestimonials';
import { Card, CardContent } from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import type { Testimonial } from '@/integrations/supabase/database.types';

const TestimonialsManagement = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    quote: '',
    highlight_word: '',
    author_name: '',
    author_role: '',
    author_image: '',
    rating: '5',
  });

  const resetForm = () => {
    setFormData({
      quote: '',
      highlight_word: '',
      author_name: '',
      author_role: '',
      author_image: '',
      rating: '5',
    });
  };

  const handleCreate = async () => {
    try {
      await createTestimonial.mutateAsync({
        quote: formData.quote,
        highlight_word: formData.highlight_word || null,
        author_name: formData.author_name,
        author_role: formData.author_role || null,
        author_image: formData.author_image || null,
        rating: parseInt(formData.rating) || 5,
      });
      toast({ title: 'Success', description: 'Testimonial created successfully!' });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      quote: testimonial.quote,
      highlight_word: testimonial.highlight_word || '',
      author_name: testimonial.author_name,
      author_role: testimonial.author_role || '',
      author_image: testimonial.author_image || '',
      rating: testimonial.rating.toString(),
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTestimonial) return;
    try {
      await updateTestimonial.mutateAsync({
        id: editingTestimonial.id,
        quote: formData.quote,
        highlight_word: formData.highlight_word || null,
        author_name: formData.author_name,
        author_role: formData.author_role || null,
        author_image: formData.author_image || null,
        rating: parseInt(formData.rating) || 5,
      });
      toast({ title: 'Success', description: 'Testimonial updated successfully!' });
      setIsEditOpen(false);
      setEditingTestimonial(null);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteTestimonial.mutateAsync(deleteConfirmId);
      toast({ title: 'Success', description: 'Testimonial deleted successfully!' });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const TestimonialForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="quote">Quote *</Label>
        <Textarea
          id="quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          placeholder="This trip was absolutely amazing..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="highlight_word">Highlight Word (optional)</Label>
        <Input
          id="highlight_word"
          value={formData.highlight_word}
          onChange={(e) => setFormData({ ...formData, highlight_word: e.target.value })}
          placeholder="amazing"
        />
        <p className="text-xs text-muted-foreground">This word will be emphasized in the quote</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author_name">Author Name *</Label>
          <Input
            id="author_name"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author_role">Role/Title</Label>
          <Input
            id="author_role"
            value={formData.author_role}
            onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
            placeholder="Travel Enthusiast"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author_image">Author Image URL</Label>
          <Input
            id="author_image"
            value={formData.author_image}
            onChange={(e) => setFormData({ ...formData, author_image: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={!formData.quote || !formData.author_name}>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-2">Manage customer reviews and testimonials</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Testimonial</DialogTitle>
            </DialogHeader>
            <TestimonialForm onSubmit={handleCreate} submitLabel="Create Testimonial" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Table */}
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
                  <TableHead>Author</TableHead>
                  <TableHead className="max-w-md">Quote</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials?.map((testimonial) => (
                  <TableRow key={testimonial.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={testimonial.author_image || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {testimonial.author_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.author_name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.author_role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate text-muted-foreground">{testimonial.quote}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(testimonial.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {testimonials?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No testimonials yet
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          <TestimonialForm onSubmit={handleUpdate} submitLabel="Update Testimonial" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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

export default TestimonialsManagement;
