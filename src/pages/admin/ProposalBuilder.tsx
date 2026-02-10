import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateProposal, useUpdateProposal } from '@/hooks/useProposals';
import { CreateProposalInput, BookedExperience } from '@/types/proposals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { uploadProposalImage } from '@/lib/proposalImageUpload';
import { sendProposalNotificationEmail } from '@/lib/emailService';
import { supabase } from '@/integrations/supabase/client';

export default function ProposalBuilder() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('userId');
    const quizResponseId = searchParams.get('quizId');

    const createProposal = useCreateProposal();
    const updateProposal = useUpdateProposal();

    const [formData, setFormData] = useState<Partial<CreateProposalInput>>({
        user_id: userId || '',
        quiz_response_id: quizResponseId || undefined,
        title: '',
        destination_name: '',
        destination_tagline: '',
        hero_image_url: '',
        destination_highlights: [],
        destination_description: '',
        booked_experiences: [],
        departure_date: '',
        return_date: '',
        duration_days: 0,
        total_price: 0,
        currency: 'INR',
        deposit_percentage: 25,
    });

    const [experiences, setExperiences] = useState<BookedExperience[]>([]);
    const [highlights, setHighlights] = useState<string[]>(['']);
    const [uploading, setUploading] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');

    // Fetch user details for email
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('email, full_name')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setUserEmail((data as any).email || '');
                setUserName((data as any).full_name || 'Traveler');

                // Auto-populate title with user's name
                if ((data as any).full_name && !formData.title) {
                    setFormData(prev => ({
                        ...prev,
                        title: `${(data as any).full_name}, LET'S SEND YOU SOMEWHERE AMAZING!`
                    }));
                }
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleImageUpload = async (file: File, type: 'hero' | 'experience', index?: number) => {
        setUploading(true);
        try {
            const url = await uploadProposalImage(file, type === 'hero' ? 'hero' : 'experiences');

            if (type === 'hero') {
                setFormData(prev => ({ ...prev, hero_image_url: url }));
            } else if (index !== undefined) {
                const newExperiences = [...experiences];
                newExperiences[index].image_url = url;
                setExperiences(newExperiences);
            }

            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const addExperience = () => {
        setExperiences([...experiences, {
            title: '',
            description: '',
            category: '',
            icon: '',
        }]);
    };

    const removeExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const updateExperience = (index: number, field: keyof BookedExperience, value: string) => {
        const newExperiences = [...experiences];
        newExperiences[index] = { ...newExperiences[index], [field]: value };
        setExperiences(newExperiences);
    };

    const addHighlight = () => {
        setHighlights([...highlights, '']);
    };

    const updateHighlight = (index: number, value: string) => {
        const newHighlights = [...highlights];
        newHighlights[index] = value;
        setHighlights(newHighlights);
    };

    const removeHighlight = (index: number) => {
        setHighlights(highlights.filter((_, i) => i !== index));
    };

    const handleSubmit = async (status: 'draft' | 'sent') => {
        if (!formData.user_id || !formData.title || !formData.destination_name || !formData.total_price) {
            toast.error('Please fill in all required fields');
            return;
        }

        const proposalData: CreateProposalInput = {
            ...formData as CreateProposalInput,
            booked_experiences: experiences.filter(exp => exp.title),
            destination_highlights: highlights.filter(h => h.trim()),
        };

        try {
            const proposal = await createProposal.mutateAsync(proposalData);

            if (status === 'sent') {
                await updateProposal.mutateAsync({ id: proposal.id, status: 'sent' });

                // Send email notification
                if (userEmail) {
                    try {
                        await sendProposalNotificationEmail({
                            userEmail,
                            userName,
                            proposalId: proposal.id,
                            destinationName: proposal.destination_name,
                            expiryDate: proposal.expiry_date,
                        });
                        toast.success('Proposal sent and email delivered!');
                    } catch (emailError) {
                        console.error('Email failed:', emailError);
                        toast.success('Proposal sent (email notification failed)');
                    }
                } else {
                    toast.success('Proposal sent successfully!');
                }
            } else {
                toast.success('Proposal saved as draft');
            }

            navigate('/admin/quizzes');
        } catch (error) {
            toast.error('Failed to save proposal');
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Create Trip Proposal</h1>
                <p className="text-muted-foreground">Build a personalized trip proposal for your customer</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Form */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Proposal Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Sravankumar, LET'S SEND YOU SOMEWHERE AMAZING!"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="destination">Destination Name *</Label>
                                <Input
                                    id="destination"
                                    placeholder="e.g., Bali, Indonesia"
                                    value={formData.destination_name}
                                    onChange={(e) => setFormData({ ...formData, destination_name: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    placeholder="e.g., Matched to your style and ready-to-book"
                                    value={formData.destination_tagline}
                                    onChange={(e) => setFormData({ ...formData, destination_tagline: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="hero-image">Hero Image</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="hero-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero')}
                                        disabled={uploading}
                                    />
                                    {uploading && <Loader2 className="animate-spin" />}
                                </div>
                                {formData.hero_image_url && (
                                    <img src={formData.hero_image_url} alt="Hero" className="mt-2 w-full h-40 object-cover rounded" />
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Destination Highlights */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Destination Highlights</h2>
                            <Button onClick={addHighlight} size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-2" /> Add
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., Beautiful beaches"
                                        value={highlight}
                                        onChange={(e) => updateHighlight(index, e.target.value)}
                                    />
                                    <Button
                                        onClick={() => removeHighlight(index)}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Description */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Description</h2>
                        <Textarea
                            placeholder="Describe the destination and what makes it special..."
                            value={formData.destination_description}
                            onChange={(e) => setFormData({ ...formData, destination_description: e.target.value })}
                            rows={6}
                        />
                    </Card>

                    {/* Experiences */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Booked Experiences</h2>
                            <Button onClick={addExperience} size="sm">
                                <Plus className="w-4 h-4 mr-2" /> Add Experience
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {experiences.map((exp, index) => (
                                <Card key={index} className="p-4 border-2">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-medium">Experience {index + 1}</h3>
                                        <Button
                                            onClick={() => removeExperience(index)}
                                            size="sm"
                                            variant="ghost"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Experience title"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                        />
                                        <Textarea
                                            placeholder="Description"
                                            value={exp.description}
                                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                            rows={3}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Category (e.g., Adventure)"
                                                value={exp.category}
                                                onChange={(e) => updateExperience(index, 'category', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Icon (emoji or name)"
                                                value={exp.icon}
                                                onChange={(e) => updateExperience(index, 'icon', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'experience', index)}
                                                disabled={uploading}
                                            />
                                            {exp.image_url && (
                                                <img src={exp.image_url} alt={exp.title} className="mt-2 w-full h-32 object-cover rounded" />
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>

                    {/* Dates & Pricing */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Dates & Pricing</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="departure">Departure Date</Label>
                                <Input
                                    id="departure"
                                    type="date"
                                    value={formData.departure_date}
                                    onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="return">Return Date</Label>
                                <Input
                                    id="return"
                                    type="date"
                                    value={formData.return_date}
                                    onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration (days)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={formData.duration_days}
                                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Total Price (INR) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.total_price}
                                    onChange={(e) => setFormData({ ...formData, total_price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleSubmit('draft')}
                            variant="outline"
                            disabled={createProposal.isPending}
                            className="flex-1"
                        >
                            {createProposal.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save as Draft
                        </Button>
                        <Button
                            onClick={() => handleSubmit('sent')}
                            disabled={createProposal.isPending}
                            className="flex-1"
                        >
                            {createProposal.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Publish & Notify
                        </Button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
                        <div className="bg-muted rounded-lg p-4 space-y-4">
                            {formData.hero_image_url && (
                                <img src={formData.hero_image_url} alt="Hero" className="w-full h-48 object-cover rounded" />
                            )}
                            <div>
                                <h3 className="text-2xl font-bold">{formData.title || 'Proposal Title'}</h3>
                                <p className="text-lg text-muted-foreground">{formData.destination_name || 'Destination'}</p>
                                <p className="text-sm">{formData.destination_tagline}</p>
                            </div>
                            {highlights.filter(h => h).length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Highlights:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {highlights.filter(h => h).map((h, i) => (
                                            <li key={i} className="text-sm">{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {experiences.filter(e => e.title).length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">{experiences.filter(e => e.title).length} Experiences</h4>
                                    <div className="space-y-2">
                                        {experiences.filter(e => e.title).map((exp, i) => (
                                            <div key={i} className="text-sm border-l-2 pl-2">
                                                <p className="font-medium">{exp.icon} {exp.title}</p>
                                                <p className="text-xs text-muted-foreground">{exp.category}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {formData.total_price > 0 && (
                                <div className="border-t pt-4">
                                    <p className="text-2xl font-bold">₹{formData.total_price?.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Deposit: ₹{((formData.total_price || 0) * 0.25).toLocaleString()} (25%)
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
