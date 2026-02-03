import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    Sparkles, Search, Loader2, RefreshCw, User, Calendar,
    DollarSign, MapPin, CheckCircle, Clock, XCircle, Send, Gift,
    Eye, Download, AlertTriangle, Users, Plane, Heart, Ban
} from 'lucide-react';
import {
    OnboardingQuizRecord,
    VIBE_OPTIONS,
    COMPANION_OPTIONS,
    BUDGET_OPTIONS,
    TRIP_STYLE_OPTIONS,
    TravelVibe
} from '@/types/onboarding-quiz';

// Fetch quizzes from the database
const fetchOnboardingQuizzes = async () => {
    const { data, error } = await supabase
        .from('onboarding_quiz_responses')
        .select(`
      *,
      profiles:user_id (
        id,
        email,
        full_name,
        phone
      )
    `)
        .eq('is_submitted', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Update quiz status
const updateQuizStatus = async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
    const { error } = await (supabase
        .from('onboarding_quiz_responses') as any)
        .update(updates)
        .eq('id', id);

    if (error) throw error;
};

const OnboardingQuizzesManagement = () => {
    const queryClient = useQueryClient();
    const { data: quizzes = [], isLoading, refetch } = useQuery({
        queryKey: ['admin-onboarding-quizzes'],
        queryFn: fetchOnboardingQuizzes,
    });

    const updateMutation = useMutation({
        mutationFn: updateQuizStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-onboarding-quizzes'] });
            toast.success('Quiz updated successfully');
        },
        onError: () => {
            toast.error('Failed to update quiz');
        },
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishData, setPublishData] = useState({
        destination: '',
        itineraryUrl: '',
        estimatedPrice: '',
        notes: '',
    });

    // Filter quizzes by status
    const pendingQuizzes = quizzes.filter((q: any) => !q.admin_reviewed);
    const wantsSurprise = quizzes.filter((q: any) => q.destination_knowledge === 'surprise');
    const reviewedQuizzes = quizzes.filter((q: any) => q.admin_reviewed);
    const hasDestination = quizzes.filter((q: any) => q.destination_preference === 'in_mind');

    // Search filter
    const filterQuizzes = (list: any[]) => {
        if (!searchQuery) return list;
        return list.filter((q: any) =>
            q.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.travel_vibe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.desired_destinations?.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    };

    // Get vibe details
    const getVibeDetails = (vibe: TravelVibe) => {
        return VIBE_OPTIONS.find(v => v.value === vibe);
    };

    // Handle marking as reviewed
    const handleMarkReviewed = async (quiz: any) => {
        await updateMutation.mutateAsync({
            id: quiz.id,
            updates: { updated_at: new Date().toISOString() } as any,
        });
    };

    // Handle publishing trip (for surprise mode)
    const handlePublishTrip = async (quiz: any) => {
        // This would update the surprise_requests table to mark the trip as ready
        await updateMutation.mutateAsync({
            id: quiz.id,
            updates: {
                updated_at: new Date().toISOString(),
            } as any,
        });

        // Also update the surprise_requests if linked
        if (quiz.linked_surprise_request_id) {
            await (supabase
                .from('surprise_requests') as any)
                .update({
                    status: 'ready',
                    suggested_destination: publishData.destination,
                    admin_notes: publishData.notes,
                })
                .eq('id', quiz.linked_surprise_request_id);
        }

        setShowPublishModal(false);
        setPublishData({ destination: '', itineraryUrl: '', estimatedPrice: '', notes: '' });
        toast.success('Trip published! User will receive the reveal option.');
    };

    // Export to CSV
    const handleExport = () => {
        const headers = [
            'Name', 'Email', 'Travel Vibe', 'Companion', 'Budget', 'Duration',
            'Trip Styles', 'Destinations', 'Submitted At'
        ];

        const rows = quizzes.map((q: any) => [
            q.profiles?.full_name || 'N/A',
            q.profiles?.email || 'N/A',
            q.travel_vibe || 'N/A',
            q.travel_companion || 'N/A',
            q.budget_range || 'N/A',
            q.trip_duration || 'N/A',
            q.trip_styles?.join(', ') || 'N/A',
            q.desired_destinations?.join(', ') || 'N/A',
            q.created_at ? format(new Date(q.created_at), 'yyyy-MM-dd') : 'N/A',
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `onboarding-quizzes-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export downloaded');
    };

    // Quiz Detail Card
    const QuizCard = ({ quiz }: { quiz: any }) => {
        const vibeDetails = quiz.travel_vibe ? getVibeDetails(quiz.travel_vibe) : null;
        const companionDetails = COMPANION_OPTIONS.find(c => c.value === quiz.travel_companion);
        const budgetDetails = BUDGET_OPTIONS.find(b => b.value === quiz.budget_range);
        const wantsSurprise = quiz.destination_knowledge === 'surprise';

        return (
            <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                {vibeDetails ? (
                                    <span className="text-xl">{vibeDetails.emoji}</span>
                                ) : (
                                    <User className="w-5 h-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    {quiz.profiles?.full_name || 'Anonymous'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {quiz.profiles?.email || `Session: ${quiz.session_id?.slice(0, 8)}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {wantsSurprise && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                    <Gift className="w-3 h-3 mr-1" />
                                    Surprise
                                </Badge>
                            )}
                            {quiz.admin_reviewed ? (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Reviewed
                                </Badge>
                            ) : (
                                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                    <Clock className="w-3 h-3 mr-1" />
                                    New
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {companionDetails?.label || quiz.travel_companion}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {budgetDetails?.label || quiz.budget_range}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {quiz.trip_duration?.replace('-', '–')} days
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {quiz.departure_location || 'Not specified'}
                            </span>
                        </div>
                    </div>

                    {/* Trip Styles */}
                    {quiz.trip_styles && quiz.trip_styles.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Trip Styles:</p>
                            <div className="flex flex-wrap gap-1">
                                {quiz.trip_styles.slice(0, 3).map((style: string) => {
                                    const styleDetails = TRIP_STYLE_OPTIONS.find(s => s.value === style);
                                    return (
                                        <Badge key={style} variant="secondary" className="text-xs">
                                            {styleDetails?.emoji} {styleDetails?.label || style}
                                        </Badge>
                                    );
                                })}
                                {quiz.trip_styles.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{quiz.trip_styles.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Hard No's */}
                    {quiz.hard_no_activities && quiz.hard_no_activities.length > 0 && (
                        <div className="mb-4 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Ban className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-xs font-medium">Hard No's:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {quiz.hard_no_activities.map((activity: string) => (
                                    <Badge key={activity} className="text-xs bg-red-500/20 text-red-300 border-none">
                                        {activity}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Destinations */}
                    {quiz.desired_destinations && quiz.desired_destinations.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-muted-foreground mb-2">Desired Destinations:</p>
                            <div className="flex flex-wrap gap-1">
                                {quiz.desired_destinations.map((dest: string) => (
                                    <Badge key={dest} variant="outline" className="text-xs">
                                        <Plane className="w-3 h-3 mr-1" />
                                        {dest}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submitted Date */}
                    <p className="text-xs text-muted-foreground mb-4">
                        Submitted: {quiz.created_at && format(new Date(quiz.created_at), 'MMM dd, yyyy h:mm a')}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setSelectedQuiz(quiz);
                                setShowDetailModal(true);
                            }}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                        </Button>

                        {!quiz.admin_reviewed && (
                            <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleMarkReviewed(quiz)}
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                Mark Reviewed
                            </Button>
                        )}

                        {wantsSurprise && !quiz.admin_reviewed && (
                            <Button
                                size="sm"
                                variant="default"
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={() => {
                                    setSelectedQuiz(quiz);
                                    setShowPublishModal(true);
                                }}
                            >
                                <Send className="w-4 h-4 mr-1" />
                                Publish Trip
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
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
                    <h1 className="text-3xl font-display font-bold text-foreground">Onboarding Quizzes</h1>
                    <p className="text-muted-foreground mt-1">Review user travel preferences from the 17-step quiz</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => refetch()} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/20">
                                <Clock className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{pendingQuizzes.length}</p>
                                <p className="text-xs text-muted-foreground">Pending Review</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Gift className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{wantsSurprise.length}</p>
                                <p className="text-xs text-muted-foreground">Want Surprise</p>
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
                                <p className="text-2xl font-bold text-foreground">{hasDestination.length}</p>
                                <p className="text-xs text-muted-foreground">Has Destination</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/20">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{reviewedQuizzes.length}</p>
                                <p className="text-xs text-muted-foreground">Reviewed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, email, vibe, destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="pending" className="gap-2">
                        <Clock className="w-4 h-4" />
                        New ({pendingQuizzes.length})
                    </TabsTrigger>
                    <TabsTrigger value="surprise" className="gap-2">
                        <Gift className="w-4 h-4" />
                        Surprise ({wantsSurprise.filter((q: any) => !q.admin_reviewed).length})
                    </TabsTrigger>
                    <TabsTrigger value="reviewed" className="gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Reviewed ({reviewedQuizzes.length})
                    </TabsTrigger>
                    <TabsTrigger value="all" className="gap-2">
                        <Users className="w-4 h-4" />
                        All ({quizzes.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    {filterQuizzes(pendingQuizzes).length === 0 ? (
                        <Card className="bg-card/50 border-border/50">
                            <CardContent className="p-12 text-center">
                                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No pending quizzes to review</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filterQuizzes(pendingQuizzes).map(quiz => (
                                <QuizCard key={quiz.id} quiz={quiz} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="surprise" className="mt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterQuizzes(wantsSurprise).map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="reviewed" className="mt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterQuizzes(reviewedQuizzes).map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filterQuizzes(quizzes).map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Detail Modal */}
            <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
                <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Quiz Details</DialogTitle>
                        <DialogDescription>
                            Full travel preferences for {selectedQuiz?.profiles?.full_name || 'this user'}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedQuiz && (
                        <div className="space-y-6 pt-4">
                            {/* Vibe */}
                            {selectedQuiz.travel_vibe && (
                                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">
                                            {getVibeDetails(selectedQuiz.travel_vibe)?.emoji}
                                        </span>
                                        <div>
                                            <p className="font-bold text-primary text-lg">
                                                {getVibeDetails(selectedQuiz.travel_vibe)?.label}
                                            </p>
                                            <p className="text-muted-foreground text-sm">Travel Vibe</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grid of details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Travel Companion</Label>
                                    <p className="font-medium">{selectedQuiz.travel_companion}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Budget Range</Label>
                                    <p className="font-medium">{selectedQuiz.budget_range}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Trip Duration</Label>
                                    <p className="font-medium">{selectedQuiz.trip_duration} days</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Experience Pace</Label>
                                    <p className="font-medium">{selectedQuiz.experience_pace}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Departure From</Label>
                                    <p className="font-medium">{selectedQuiz.departure_location || 'Not specified'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Passport</Label>
                                    <p className="font-medium">{selectedQuiz.passport_nationality}</p>
                                </div>
                            </div>

                            {/* Trip Styles */}
                            {selectedQuiz.trip_styles?.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground mb-2 block">Trip Styles</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuiz.trip_styles.map((style: string) => {
                                            const details = TRIP_STYLE_OPTIONS.find(s => s.value === style);
                                            return (
                                                <Badge key={style} className="text-sm">
                                                    {details?.emoji} {details?.label || style}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Desired Destinations */}
                            {selectedQuiz.desired_destinations?.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground mb-2 block">Desired Destinations</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuiz.desired_destinations.map((dest: string) => (
                                            <Badge key={dest} variant="outline">
                                                <Plane className="w-3 h-3 mr-1" />
                                                {dest}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Places to Avoid */}
                            {selectedQuiz.places_to_avoid?.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground mb-2 block">Places to Avoid</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuiz.places_to_avoid.map((place: string) => (
                                            <Badge key={place} variant="destructive">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                {place}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Hard No Activities */}
                            {selectedQuiz.hard_no_activities?.length > 0 && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <Label className="text-red-400 mb-2 block flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Hard No Activities
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuiz.hard_no_activities.map((activity: string) => (
                                            <Badge key={activity} className="bg-red-500/20 text-red-300">
                                                {activity}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Food Preferences */}
                            {selectedQuiz.food_preferences?.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground mb-2 block">Food Preferences</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuiz.food_preferences.map((food: string) => (
                                            <Badge key={food} className="bg-green-500/20 text-green-400">
                                                {food}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Health Conditions */}
                            {selectedQuiz.health_conditions?.length > 0 && (
                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <Label className="text-amber-400 mb-2 block flex items-center gap-2">
                                        <Heart className="w-4 h-4" />
                                        Health Considerations
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuiz.health_conditions.map((condition: string) => (
                                            <Badge key={condition} className="bg-amber-500/20 text-amber-300">
                                                {condition}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Publish Trip Modal */}
            <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
                <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-foreground flex items-center gap-2">
                            <Gift className="w-5 h-5 text-purple-500" />
                            Publish Surprise Trip
                        </DialogTitle>
                        <DialogDescription>
                            Set the destination and details for {selectedQuiz?.profiles?.full_name}'s surprise trip
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Destination</Label>
                            <Input
                                value={publishData.destination}
                                onChange={(e) => setPublishData(p => ({ ...p, destination: e.target.value }))}
                                placeholder="e.g., Bali, Indonesia"
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Itinerary URL</Label>
                            <Input
                                value={publishData.itineraryUrl}
                                onChange={(e) => setPublishData(p => ({ ...p, itineraryUrl: e.target.value }))}
                                placeholder="Link to PDF or document"
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Estimated Price (₹)</Label>
                            <Input
                                value={publishData.estimatedPrice}
                                onChange={(e) => setPublishData(p => ({ ...p, estimatedPrice: e.target.value }))}
                                placeholder="e.g., 75,000"
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Admin Notes</Label>
                            <Textarea
                                value={publishData.notes}
                                onChange={(e) => setPublishData(p => ({ ...p, notes: e.target.value }))}
                                placeholder="Any notes about this trip..."
                                className="bg-background/50"
                            />
                        </div>

                        <Button
                            onClick={() => selectedQuiz && handlePublishTrip(selectedQuiz)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            disabled={!publishData.destination || updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            Publish & Notify User
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OnboardingQuizzesManagement;
