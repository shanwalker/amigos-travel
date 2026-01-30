import { useState } from 'react';
import { useStories, useCreateStory, useUpdateStory, useDeleteStory, BlogPost } from '@/hooks/useStories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Pencil, Trash2, Eye, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const StoriesManagement = () => {
  const { data: stories, isLoading } = useStories();
  const createStory = useCreateStory();
  const updateStory = useUpdateStory();
  const deleteStory = useDeleteStory();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Partial<BlogPost>>({});
  const [isCreateMode, setIsCreateMode] = useState(false);

  const handleEdit = (story: BlogPost) => {
    setEditingStory(story);
    setIsCreateMode(false);
    setIsEditOpen(true);
  };

  const handleCreate = () => {
    setEditingStory({ status: 'draft' });
    setIsCreateMode(true);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await createStory.mutateAsync({
          ...editingStory,
          slug: editingStory.title?.toLowerCase().replace(/\s+/g, '-') || '',
        });
        toast({ title: 'Story created' });
      } else {
        if (!editingStory.id) return;
        await updateStory.mutateAsync({
          id: editingStory.id,
          ...editingStory,
        });
        toast({ title: 'Story updated' });
      }
      setIsEditOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      await deleteStory.mutateAsync(id);
      toast({ title: 'Story deleted' });
    }
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Travel Stories</h1>
          <p className="text-muted-foreground">Manage blog posts and travel guides</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Story
        </Button>
      </div>

      <Card className="bg-card/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No stories found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                stories?.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {story.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={story.status === 'published' ? 'default' : 'secondary'}>
                        {story.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{story.category || 'Uncategorized'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(story.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(story)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(story.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreateMode ? 'New Story' : 'Edit Story'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editingStory.title || ''}
                onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={editingStory.category || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                  placeholder="e.g. Travel Guide"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingStory.status}
                  onValueChange={(value: any) => setEditingStory({ ...editingStory, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={editingStory.excerpt || ''}
                onChange={(e) => setEditingStory({ ...editingStory, excerpt: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input
                value={editingStory.cover_image || ''}
                onChange={(e) => setEditingStory({ ...editingStory, cover_image: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Content (HTML/Markdown)</Label>
              <Textarea
                value={editingStory.content || ''}
                onChange={(e) => setEditingStory({ ...editingStory, content: e.target.value })}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Ideally use a rich text editor here later.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Story</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoriesManagement;
