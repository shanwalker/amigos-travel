import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
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
import { Plus, Trash2, Star, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TripImage {
    id: string;
    url: string;
    caption?: string;
    is_featured: boolean;
    order: number;
}

interface ImageGalleryProps {
    tripId?: string;
    initialImages?: TripImage[];
    onSave?: (images: TripImage[]) => void;
}

export const ImageGallery = ({ tripId, initialImages = [], onSave }: ImageGalleryProps) => {
    const [images, setImages] = useState<TripImage[]>(initialImages);
    const [isAddingImage, setIsAddingImage] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageCaption, setImageCaption] = useState('');

    const handleAddImage = () => {
        if (!imageUrl) {
            toast({ title: 'Error', description: 'Please enter an image URL', variant: 'destructive' });
            return;
        }

        const newImage: TripImage = {
            id: `img-${Date.now()}`,
            url: imageUrl,
            caption: imageCaption || undefined,
            is_featured: images.length === 0, // First image is featured by default
            order: images.length,
        };

        setImages([...images, newImage]);
        setIsAddingImage(false);
        setImageUrl('');
        setImageCaption('');
        toast({ title: 'Success', description: 'Image added to gallery!' });
    };

    const handleDeleteImage = () => {
        if (!deleteConfirmId) return;

        const updatedImages = images
            .filter(img => img.id !== deleteConfirmId)
            .map((img, index) => ({ ...img, order: index }));

        // If deleted image was featured, make first image featured
        if (updatedImages.length > 0 && !updatedImages.some(img => img.is_featured)) {
            updatedImages[0].is_featured = true;
        }

        setImages(updatedImages);
        setDeleteConfirmId(null);
        toast({ title: 'Success', description: 'Image removed from gallery!' });
    };

    const handleSetFeatured = (id: string) => {
        const updatedImages = images.map(img => ({
            ...img,
            is_featured: img.id === id,
        }));
        setImages(updatedImages);
        toast({ title: 'Success', description: 'Featured image updated!' });
    };

    const handleSave = () => {
        if (onSave) {
            onSave(images);
        }
        toast({ title: 'Success', description: 'Gallery saved successfully!' });
    };

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-foreground">Image Gallery</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsAddingImage(true)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Image
                        </Button>
                        {images.length > 0 && (
                            <Button onClick={handleSave} size="sm" variant="outline">
                                Save Gallery
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {images.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No images in gallery yet</p>
                        <Button onClick={() => setIsAddingImage(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload First Image
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-lg overflow-hidden bg-background border border-border/50">
                                    <img
                                        src={image.url}
                                        alt={image.caption || `Trip image ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Not+Found';
                                        }}
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant={image.is_featured ? "default" : "secondary"}
                                            onClick={() => handleSetFeatured(image.id)}
                                            className="w-32"
                                        >
                                            <Star className={`mr-2 h-4 w-4 ${image.is_featured ? 'fill-current' : ''}`} />
                                            {image.is_featured ? 'Featured' : 'Set Featured'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setDeleteConfirmId(image.id)}
                                            className="w-32"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>

                                    {/* Featured Badge */}
                                    {image.is_featured && (
                                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black border-0">
                                            <Star className="h-3 w-3 mr-1 fill-current" />
                                            Featured
                                        </Badge>
                                    )}
                                </div>

                                {/* Caption */}
                                {image.caption && (
                                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                        {image.caption}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Add Image Dialog */}
            <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Image</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL *</Label>
                            <Input
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the full URL of the image
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageCaption">Caption (optional)</Label>
                            <Input
                                id="imageCaption"
                                value={imageCaption}
                                onChange={(e) => setImageCaption(e.target.value)}
                                placeholder="Beautiful sunset at the beach"
                            />
                        </div>

                        {imageUrl && (
                            <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="aspect-video rounded-lg overflow-hidden bg-background border border-border">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Invalid+URL';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddImage} disabled={!imageUrl}>
                            Add Image
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the image from the gallery.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};
