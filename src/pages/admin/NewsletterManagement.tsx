import { useState } from 'react';
import { useSubscribers, useCampaigns, useCreateCampaign, useSendCampaign, Campaign } from '@/hooks/useNewsletter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, Send, Plus, Users, BarChart } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const NewsletterManagement = () => {
  const { data: subscribers, isLoading: isSubLoading } = useSubscribers();
  const { data: campaigns, isLoading: isCampLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const sendCampaign = useSendCampaign();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({ status: 'draft' });

  const handleCreate = async () => {
    try {
      await createCampaign.mutateAsync(newCampaign);
      toast({ title: 'Campaign created' });
      setIsCreateOpen(false);
      setNewCampaign({ status: 'draft' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSend = async (id: string) => {
    if (confirm('Are you sure you want to send this campaign now?')) {
      try {
        await sendCampaign.mutateAsync(id);
        toast({ title: 'Campaign sent successfully' });
      } catch (error: any) {
        toast({ title: 'Error sending campaign', description: error.message });
      }
    }
  };

  if (isSubLoading || isCampLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Newsletter</h1>
        <p className="text-muted-foreground">Manage subscribers and email campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Subscribers</p>
              <p className="text-3xl font-bold">{subscribers?.length || 0}</p>
            </div>
            <Users className="h-8 w-8 text-primary/20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sent Campaigns</p>
              <p className="text-3xl font-bold">{campaigns?.filter(c => c.status === 'sent').length || 0}</p>
            </div>
            <Send className="h-8 w-8 text-green-500/20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              <p className="text-3xl font-bold">24%</p>
            </div>
            <BarChart className="h-8 w-8 text-blue-500/20" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns?.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="font-medium">{campaign.title}</div>
                        <div className="text-xs text-muted-foreground">{campaign.subject}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.sent_at ? format(new Date(campaign.sent_at), 'MMM d, hh:mm a') : '-'}
                      </TableCell>
                      <TableCell>
                        {campaign.status === 'sent' && (
                          <div className="text-xs text-muted-foreground">
                            {campaign.recipient_count} recipients
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.status === 'draft' && (
                          <Button size="sm" onClick={() => handleSend(campaign.id)}>
                            <Send className="mr-2 h-3 w-3" /> Send
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers?.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell>
                        <Badge variant={sub.status === 'subscribed' ? 'outline' : 'destructive'}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{sub.source}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(sub.subscribed_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Internal Title</Label>
              <Input
                value={newCampaign.title || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input
                value={newCampaign.subject || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Content (HTML)</Label>
              <Textarea
                value={newCampaign.content || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterManagement;
