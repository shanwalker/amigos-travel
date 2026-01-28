import { useState } from 'react';
import { useWishlist, useRemoveFromWishlist, useUpdateWishlistNotes, useUpdateWishlistPriority, useClearWishlist } from '@/hooks/useWishlist';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MapPin, Calendar, DollarSign, Trash2, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const MyWishlist = () => {
    const { data: wishlist = [], isLoading } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();
    const updateNotes = useUpdateWishlistNotes();
    const updatePriority = useUpdateWishlistPriority();
    const clearWishlist = useClearWishlist();

    const [editingNotes, setEditingNotes] = useState<string | null>(null);
    const [notesText, setNotesText] = useState('');

    const handleEditNotes = (tripId: string, currentNotes?: string) => {
        setEditingNotes(tripId);
        setNotesText(currentNotes || '');
    };

    const handleSaveNotes = (tripId: string) => {
        updateNotes.mutate({ tripId, notes: notesText });
        setEditingNotes(null);
    };

    const handleCancelEdit = () => {
        setEditingNotes(null);
        setNotesText('');
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/10 text-red-500';
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'low':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">My Wishlist</h1>
                    <p className="text-muted-foreground mt-2">Your saved trips and dream destinations</p>
                </div>
                {wishlist.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">Clear Wishlist?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                    Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-background border-border">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground"
                                    onClick={() => clearWishlist.mutate()}
                                >
                                    Yes, Clear All
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {wishlist.length === 0 ? (
                <Card className="bg-card/50 border-border/50">
                    <CardContent className="py-12 text-center">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Your Wishlist is Empty</h3>
                        <p className="text-muted-foreground mb-4">
                            Start adding trips you love to your wishlist!
                        </p>
                        <Button
                            className="bg-primary text-primary-foreground"
                            onClick={() => window.location.href = '/dashboard/trips'}
                        >
                            Browse Trips
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {wishlist.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col">
                                        {/* Trip Image */}
                                        {item.trip?.image_url && (
                                            <div
                                                className="h-48 bg-cover bg-center relative"
                                                style={{ backgroundImage: `url(${item.trip.image_url})` }}
                                            >
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <Badge variant="secondary" className={getPriorityColor(item.priority || 'medium')}>
                                                        {item.priority || 'medium'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}

                                        {/* Trip Details */}
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold mb-2">{item.trip?.name}</h3>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{item.trip?.destination}, {item.trip?.country}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{item.trip?.duration_days} days</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-semibold text-primary">₹{item.trip?.price?.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Priority Selector */}
                                            <div className="mb-4">
                                                <label className="text-sm text-muted-foreground mb-2 block">Priority</label>
                                                <Select
                                                    value={item.priority || 'medium'}
                                                    onValueChange={(value) => updatePriority.mutate({ tripId: item.trip_id, priority: value as any })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="high">High</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="low">Low</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Notes Section */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm text-muted-foreground">Notes</label>
                                                    {editingNotes !== item.trip_id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditNotes(item.trip_id, item.notes)}
                                                        >
                                                            <Edit2 className="h-3 w-3 mr-1" />
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                                {editingNotes === item.trip_id ? (
                                                    <div className="space-y-2">
                                                        <Textarea
                                                            value={notesText}
                                                            onChange={(e) => setNotesText(e.target.value)}
                                                            placeholder="Add your notes..."
                                                            rows={3}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleSaveNotes(item.trip_id)}
                                                            >
                                                                <Save className="h-3 w-3 mr-1" />
                                                                Save
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleCancelEdit}
                                                            >
                                                                <X className="h-3 w-3 mr-1" />
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.notes || 'No notes added'}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => window.location.href = `/trips/${item.trip_id}`}
                                                >
                                                    View Trip
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="border-destructive text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeFromWishlist.mutate(item.trip_id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWishlist;
