import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DollarSign, Percent, Calendar, Users, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface PricingVariation {
    id: string;
    type: 'early_bird' | 'group' | 'seasonal' | 'addon';
    name: string;
    amount: number;
    is_percentage: boolean;
    conditions?: string;
    is_active: boolean;
}

interface PricingManagerProps {
    basePrice: number;
    onBasePriceChange?: (price: number) => void;
    initialVariations?: PricingVariation[];
    onSave?: (variations: PricingVariation[]) => void;
}

export const PricingManager = ({
    basePrice: initialBasePrice = 0,
    onBasePriceChange,
    initialVariations = [],
    onSave,
}: PricingManagerProps) => {
    const [basePrice, setBasePrice] = useState(initialBasePrice);
    const [variations, setVariations] = useState<PricingVariation[]>(initialVariations);
    const [isAdding, setIsAdding] = useState(false);
    const [newVariation, setNewVariation] = useState({
        type: 'early_bird' as const,
        name: '',
        amount: 0,
        is_percentage: true,
        conditions: '',
    });

    const variationTypes = [
        { value: 'early_bird', label: 'Early Bird Discount', icon: Calendar },
        { value: 'group', label: 'Group Discount', icon: Users },
        { value: 'seasonal', label: 'Seasonal Pricing', icon: Calendar },
        { value: 'addon', label: 'Add-on Service', icon: Plus },
    ];

    const handleBasePriceChange = (value: string) => {
        const price = parseFloat(value) || 0;
        setBasePrice(price);
        if (onBasePriceChange) {
            onBasePriceChange(price);
        }
    };

    const handleAddVariation = () => {
        if (!newVariation.name || newVariation.amount === 0) {
            toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
            return;
        }

        const variation: PricingVariation = {
            id: `var-${Date.now()}`,
            ...newVariation,
            is_active: true,
        };

        setVariations([...variations, variation]);
        setIsAdding(false);
        setNewVariation({
            type: 'early_bird',
            name: '',
            amount: 0,
            is_percentage: true,
            conditions: '',
        });
        toast({ title: 'Success', description: 'Pricing variation added!' });
    };

    const handleToggleVariation = (id: string) => {
        setVariations(variations.map(v =>
            v.id === id ? { ...v, is_active: !v.is_active } : v
        ));
    };

    const handleDeleteVariation = (id: string) => {
        setVariations(variations.filter(v => v.id !== id));
        toast({ title: 'Success', description: 'Pricing variation removed!' });
    };

    const handleSave = () => {
        if (onSave) {
            onSave(variations);
        }
        toast({ title: 'Success', description: 'Pricing saved successfully!' });
    };

    const calculateFinalPrice = () => {
        let finalPrice = basePrice;

        variations.forEach(variation => {
            if (!variation.is_active) return;

            if (variation.type === 'addon') {
                // Add-ons increase price
                if (variation.is_percentage) {
                    finalPrice += (basePrice * variation.amount) / 100;
                } else {
                    finalPrice += variation.amount;
                }
            } else {
                // Discounts decrease price
                if (variation.is_percentage) {
                    finalPrice -= (basePrice * variation.amount) / 100;
                } else {
                    finalPrice -= variation.amount;
                }
            }
        });

        return Math.max(0, finalPrice);
    };

    const getVariationIcon = (type: string) => {
        const varType = variationTypes.find(v => v.value === type);
        return varType?.icon || DollarSign;
    };

    const getVariationColor = (type: string) => {
        switch (type) {
            case 'early_bird':
                return 'from-blue-500 to-cyan-500';
            case 'group':
                return 'from-green-500 to-emerald-500';
            case 'seasonal':
                return 'from-purple-500 to-pink-500';
            case 'addon':
                return 'from-orange-500 to-red-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Base Price */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle className="text-foreground">Base Price</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="basePrice">Price per Person (₹)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="basePrice"
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) => handleBasePriceChange(e.target.value)}
                                    className="pl-10"
                                    placeholder="45000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Estimated Final Price</Label>
                            <div className="h-10 px-4 rounded-md border border-border bg-background/50 flex items-center">
                                <span className="text-2xl font-bold text-primary">
                                    ₹{calculateFinalPrice().toLocaleString()}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                After applying {variations.filter(v => v.is_active).length} active variation(s)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Variations */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-foreground">Pricing Variations</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Discounts, seasonal pricing, and add-ons
                            </p>
                        </div>
                        <Button onClick={() => setIsAdding(!isAdding)} size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Variation
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add Variation Form */}
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-lg bg-background/50 border border-border space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={newVariation.type}
                                        onValueChange={(value: any) => setNewVariation({ ...newVariation, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {variationTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={newVariation.name}
                                        onChange={(e) => setNewVariation({ ...newVariation, name: e.target.value })}
                                        placeholder="e.g., Book 30 days early"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <Input
                                        type="number"
                                        value={newVariation.amount}
                                        onChange={(e) => setNewVariation({ ...newVariation, amount: parseFloat(e.target.value) || 0 })}
                                        placeholder="10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <div className="flex items-center gap-4 h-10">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={newVariation.is_percentage}
                                                onCheckedChange={(checked) => setNewVariation({ ...newVariation, is_percentage: checked })}
                                            />
                                            <span className="text-sm">
                                                {newVariation.is_percentage ? 'Percentage (%)' : 'Fixed Amount (₹)'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Conditions (optional)</Label>
                                <Input
                                    value={newVariation.conditions}
                                    onChange={(e) => setNewVariation({ ...newVariation, conditions: e.target.value })}
                                    placeholder="e.g., Minimum 4 people"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleAddVariation}>Add Variation</Button>
                                <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Variations List */}
                    {variations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No pricing variations added yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {variations.map((variation, index) => {
                                const Icon = getVariationIcon(variation.type);
                                return (
                                    <motion.div
                                        key={variation.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${variation.is_active
                                                ? 'bg-background/50 border-border/50'
                                                : 'bg-background/20 border-border/20 opacity-60'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getVariationColor(variation.type)}`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-foreground">{variation.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {variation.type.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {variation.type === 'addon' ? '+' : '-'}
                                                {variation.is_percentage ? `${variation.amount}%` : `₹${variation.amount}`}
                                                {variation.conditions && ` • ${variation.conditions}`}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={variation.is_active}
                                                onCheckedChange={() => handleToggleVariation(variation.id)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteVariation(variation.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {variations.length > 0 && (
                        <Button onClick={handleSave} className="w-full">
                            Save Pricing
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
