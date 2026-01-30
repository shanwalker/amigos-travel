import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Save, Globe, Mail, CreditCard, Bell } from 'lucide-react';

const SettingsManagement = () => {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast({ title: 'Settings saved successfully' });
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">Configure system preferences and integrations</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" /> General Information
                            </CardTitle>
                            <CardDescription>Basic company details and branding.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input defaultValue="Travel Amigo" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Support Email</Label>
                                    <Input defaultValue="support@travelamigo.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input defaultValue="+91 - 98765 43210" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <Input defaultValue="https://travelamigo.com" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" /> Email Configuration
                            </CardTitle>
                            <CardDescription>SMTP settings and email templates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>SMTP Host</Label>
                                <Input defaultValue="smtp.sendgrid.net" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>SMTP Port</Label>
                                    <Input defaultValue="587" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sender Name</Label>
                                    <Input defaultValue="Travel Amigo Team" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Welcome Email</Label>
                                    <p className="text-sm text-muted-foreground">Send automatically on signup</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Booking Confirmation</Label>
                                    <p className="text-sm text-muted-foreground">Send automatically on payment</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="pt-4">
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" /> Payment Gateway
                            </CardTitle>
                            <CardDescription>Configure Stripe or Razorpay keys.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Stripe Public Key</Label>
                                <Input type="password" value="pk_test_..." readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Stripe Secret Key</Label>
                                <Input type="password" value="sk_test_..." readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Input defaultValue="INR" />
                            </div>
                            <div className="pt-4">
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" /> System Alerts
                            </CardTitle>
                            <CardDescription>Notification preferences for admins.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>New Booking Alert</Label>
                                    <p className="text-sm text-muted-foreground">Email me when a booking is created</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>New User Alert</Label>
                                    <p className="text-sm text-muted-foreground">Email me when a user signs up</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="pt-4">
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsManagement;
