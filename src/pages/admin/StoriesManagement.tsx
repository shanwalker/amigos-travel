import { useState } from 'react';
import { useTravelStories, useCreateTravelStory, useUpdateTravelStory, useDeleteTravelStory } from '@/hooks/useTravelStories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Search, BookOpen, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { TravelStory } from '@/integrations/supabase/database.types';

const StoriesManagement = () => {
  const { data: stories, isLoading } = useTravelStories();
  const createStory = useCreateTravelStory();
  const updateStory = useUpdateTravelStory();
  const deleteStory = useDeleteTravelStory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingStory, setEditingStory] = useState<TravelStory | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    author_name: '',
    author_initials: '',
    author_location: '',
    image_url: '',
    read_time: '',
    featured: false,
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.author_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      category: '',
      author_name: '',
      author_initials: '',
      author_location: '',
      image_url: '',
      read_time: '',
      featured: false,
    });
  };

  const handleCreate = async () => {
    try {
      await createStory.mutateAsync({
        title: formData.title,
        excerpt: formData.excerpt || null,
        category: formData.category || null,
        author_name: formData.author_name,
        author_initials: formData.author_initials || formData.author_name.split(' ').map(n => n[0]).join(''),
        author_location: formData.author_location || null,
        image_url: formData.image_url || null,
        read_time: formData.read_time ? parseInt(formData.read_time) : null,
        featured: formData.featured,
        published_at: new Date().toISOString(),
      });
      toast({ title: 'Success', description: 'Story created successfully!' });
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (story: TravelStory) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      excerpt: story.excerpt || '',
      category: story.category || '',
      author_name: story.author_name,
      author_initials: story.author_initials || '',
      author_location: story.author_location || '',
      image_url: story.image_url || '',
      read_time: story.read_time?.toString() || '',
      featured: story.featured,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingStory) return;
    try {
      await updateStory.mutateAsync({
        id: editingStory.id,
        title: formData.title,
        excerpt: formData.excerpt || null,
        category: formData.category || null,
        author_name: formData.author_name,
        author_initials: formData.author_initials || formData.author_name.split(' ').map(n => n[0]).join(''),
        author_location: formData.author_location || null,
        image_url: formData.image_url || null,
        read_time: formData.read_time ? parseInt(formData.read_time) : null,
        featured: formData.featured,
      });
      toast({ title: 'Success', description: 'Story updated successfully!' });
      setIsEditOpen(false);
      setEditingStory(null);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteStory.mutateAsync(deleteConfirmId);
      toast({ title: 'Success', description: 'Story deleted successfully!' });
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const StoryForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="My Amazing Trip to Bali"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="A short summary of the story..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Adventure"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="read_time">Read Time (minutes)</Label>
          <Input
            id="read_time"
            type="number"
            value={formData.read_time}
            onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
            placeholder="5"
          />
        </div>
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
          <Label htmlFor="author_location">Author Location</Label>
          <Input
            id="author_location"
            value={formData.author_location}
            onChange={(e) => setFormData({ ...formData, author_location: e.target.value })}
            placeholder="Mumbai, India"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image_url">Cover Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
        />
        <Label htmlFor="featured">Featured Story</Label>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={!formData.title || !formData.author_name}>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Travel Stories</h1>
          <p className="text-muted-foreground mt-2">Manage blog posts and travel stories</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Story</DialogTitle>
            </DialogHeader>
            <StoryForm onSubmit={handleCreate} submitLabel="Create Story" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stories Table */}
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
                  <TableHead>Story</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Read Time</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories?.map((story) => (
                  <TableRow key={story.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {story.image_url ? (
                          <img src={story.image_url} alt={story.title} className="h-12 w-16 rounded-lg object-cover" />
                        ) : (
                          <div className="h-12 w-16 rounded-lg bg-primary/20 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{story.title}</span>
                            {story.featured && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{story.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{story.author_name}</p>
                        <p className="text-sm text-muted-foreground">{story.author_location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {story.category && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {story.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {story.read_time ? `${story.read_time} min` : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(story.published_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(story)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(story.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStories?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No stories found
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
          </DialogHeader>
          <StoryForm onSubmit={handleUpdate} submitLabel="Update Story" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
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

export default StoriesManagement;
